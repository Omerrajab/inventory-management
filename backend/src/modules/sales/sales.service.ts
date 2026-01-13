import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sale, SaleDocument, PaymentStatus } from './schemas/sale.schema';
import { InventoryService } from '../inventory/inventory.service';

import { CustomersService } from '../customers/customers.service';
import { MovementType } from '../inventory/schemas/stock-movement.schema';
import { LedgerEntryType } from '../customers/schemas/ledger.schema';


@Injectable()
export class SalesService {
    constructor(
        @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
        private readonly inventoryService: InventoryService,
        private readonly customersService: CustomersService,
    ) { }

    async create(createSaleDto: any): Promise<Sale> {
        const { items, customerId, sellerState = 'Maharashtra' } = createSaleDto; // Default seller state

        // Fetch customer to check location
        let customer;
        if (customerId) {
            customer = await this.customersService.findOne(customerId);
        }

        const isInterState = customer && customer.state && customer.state !== sellerState;

        let totalGstAmount = 0;
        let totalCgst = 0;
        let totalSgst = 0;
        let totalIgst = 0;
        let grandTotal = 0;

        const processedItems = [];

        // 1. Process items and calculate GST
        for (const item of items) {
            const product = await this.inventoryService.findOne(item.productId);
            if (product.quantity < item.quantity) {
                throw new BadRequestException(`Insufficient stock for product: ${product.name}`);
            }

            const itemBaseTotal = item.price * item.quantity;
            const itemGstRate = product.gstRate || 18;
            const itemGstAmount = (itemBaseTotal * itemGstRate) / 100;
            const itemSubtotal = itemBaseTotal + itemGstAmount;

            totalGstAmount += itemGstAmount;
            grandTotal += itemSubtotal;

            if (isInterState) {
                totalIgst += itemGstAmount;
            } else {
                totalCgst += itemGstAmount / 2;
                totalSgst += itemGstAmount / 2;
            }

            processedItems.push({
                ...item,
                gstRate: itemGstRate,
                gstAmount: itemGstAmount,
                subtotal: itemSubtotal
            });

            // 2. Reduce Stock
            await this.inventoryService.updateStock(
                item.productId,
                item.quantity,
                MovementType.OUT,
                `Sale checkout`,
                'System',
            );
        }

        // 3. Create the sale record
        const sale = new this.saleModel({
            ...createSaleDto,
            items: processedItems,
            totalAmount: grandTotal,
            taxAmount: totalGstAmount,
            cgst: totalCgst,
            sgst: totalSgst,
            igst: totalIgst
        });

        // Generate simple invoice number if not provided
        if (!sale.invoiceNumber) {
            sale.invoiceNumber = `INV-${Date.now()}`;
        }

        const savedSale = await sale.save();

        // 4. Update Customer Ledger if customer is registered
        if (customerId) {
            // Record the Sale
            await this.customersService.recordLedgerEntry(
                customerId,
                LedgerEntryType.SALE,
                grandTotal,
                savedSale._id.toString(),
                `Sale Invoice: ${savedSale.invoiceNumber}`
            );

            // If Paid, record the Payment immediately
            if (createSaleDto.paymentStatus === 'PAID') {
                await this.customersService.recordLedgerEntry(
                    customerId,
                    LedgerEntryType.PAYMENT,
                    -grandTotal,
                    savedSale._id.toString(),
                    `Payment for Invoice: ${savedSale.invoiceNumber}`
                );
            }
        }

        return this.findOne(savedSale._id.toString()) as any;

    }


    async findAll(query: any = {}): Promise<any> {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (search) {
            // Find customers matching search to include their sales
            const matchingCustomers = await this.customersService.findAll({ search, limit: 100 });
            const customerIds = matchingCustomers.data.map((c: any) => c._id);

            filter.$or = [
                { invoiceNumber: { $regex: search, $options: 'i' } },
                { customerId: { $in: customerIds } }
            ];
        }

        const sort: any = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const [data, total] = await Promise.all([
            this.saleModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('customerId')
                .exec(),
            this.saleModel.countDocuments(filter).exec(),
        ]);

        // Calculate summary stats (should be done via aggregation for efficiency, but using simple find for now)
        const allSales = await this.saleModel.find().exec();
        const totalRevenue = allSales.reduce((acc, s) => acc + s.totalAmount, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaySales = allSales.filter(s => new Date(s.createdAt) >= today);
        const todayRevenue = todaySales.reduce((acc, s) => acc + s.totalAmount, 0);
        const avgOrderValue = allSales.length > 0 ? totalRevenue / allSales.length : 0;

        return {
            data,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
            stats: {
                totalRevenue,
                todayRevenue,
                avgOrderValue
            }
        };
    }


    async findOne(id: string): Promise<Sale | null> {
        return this.saleModel.findById(id).populate('customerId').populate('items.productId').exec();
    }
}
