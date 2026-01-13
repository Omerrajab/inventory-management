"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const sale_schema_1 = require("./schemas/sale.schema");
const inventory_service_1 = require("../inventory/inventory.service");
const customers_service_1 = require("../customers/customers.service");
const stock_movement_schema_1 = require("../inventory/schemas/stock-movement.schema");
const ledger_schema_1 = require("../customers/schemas/ledger.schema");
let SalesService = class SalesService {
    saleModel;
    inventoryService;
    customersService;
    constructor(saleModel, inventoryService, customersService) {
        this.saleModel = saleModel;
        this.inventoryService = inventoryService;
        this.customersService = customersService;
    }
    async create(createSaleDto) {
        const { items, customerId, sellerState = 'Maharashtra' } = createSaleDto;
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
        for (const item of items) {
            const product = await this.inventoryService.findOne(item.productId);
            if (product.quantity < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for product: ${product.name}`);
            }
            const itemBaseTotal = item.price * item.quantity;
            const itemGstRate = product.gstRate || 18;
            const itemGstAmount = (itemBaseTotal * itemGstRate) / 100;
            const itemSubtotal = itemBaseTotal + itemGstAmount;
            totalGstAmount += itemGstAmount;
            grandTotal += itemSubtotal;
            if (isInterState) {
                totalIgst += itemGstAmount;
            }
            else {
                totalCgst += itemGstAmount / 2;
                totalSgst += itemGstAmount / 2;
            }
            processedItems.push({
                ...item,
                gstRate: itemGstRate,
                gstAmount: itemGstAmount,
                subtotal: itemSubtotal
            });
            await this.inventoryService.updateStock(item.productId, item.quantity, stock_movement_schema_1.MovementType.OUT, `Sale checkout`, 'System');
        }
        const sale = new this.saleModel({
            ...createSaleDto,
            items: processedItems,
            totalAmount: grandTotal,
            taxAmount: totalGstAmount,
            cgst: totalCgst,
            sgst: totalSgst,
            igst: totalIgst
        });
        if (!sale.invoiceNumber) {
            sale.invoiceNumber = `INV-${Date.now()}`;
        }
        const savedSale = await sale.save();
        if (customerId) {
            await this.customersService.recordLedgerEntry(customerId, ledger_schema_1.LedgerEntryType.SALE, grandTotal, savedSale._id.toString(), `Sale Invoice: ${savedSale.invoiceNumber}`);
            if (createSaleDto.paymentStatus === 'PAID') {
                await this.customersService.recordLedgerEntry(customerId, ledger_schema_1.LedgerEntryType.PAYMENT, -grandTotal, savedSale._id.toString(), `Payment for Invoice: ${savedSale.invoiceNumber}`);
            }
        }
        return this.findOne(savedSale._id.toString());
    }
    async findAll(query = {}) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (page - 1) * limit;
        const filter = {};
        if (search) {
            const matchingCustomers = await this.customersService.findAll({ search, limit: 100 });
            const customerIds = matchingCustomers.data.map((c) => c._id);
            filter.$or = [
                { invoiceNumber: { $regex: search, $options: 'i' } },
                { customerId: { $in: customerIds } }
            ];
        }
        const sort = {};
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
    async findOne(id) {
        return this.saleModel.findById(id).populate('customerId').populate('items.productId').exec();
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(sale_schema_1.Sale.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        inventory_service_1.InventoryService,
        customers_service_1.CustomersService])
], SalesService);
//# sourceMappingURL=sales.service.js.map