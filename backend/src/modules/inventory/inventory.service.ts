import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { StockMovement, StockMovementDocument, MovementType } from './schemas/stock-movement.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InventoryGateway } from './inventory.gateway';
import * as QRCode from 'qrcode';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/schemas/notification.schema';

@Injectable()
export class InventoryService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(StockMovement.name) private movementModel: Model<StockMovementDocument>,
        private readonly inventoryGateway: InventoryGateway,
        private readonly notificationsService: NotificationsService,
    ) { }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const qrCode = await QRCode.toDataURL(createProductDto.sku);
        const createdProduct = new this.productModel({ ...createProductDto, qrCode });
        return createdProduct.save();
    }

    async findAll(query: any = {}): Promise<any> {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
            ];
        }

        const sort: any = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const [data, total] = await Promise.all([
            this.productModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('categoryId')
                .exec(),
            this.productModel.countDocuments(filter).exec(),
        ]);

        return {
            data,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
        };
    }


    async findOne(id: string): Promise<ProductDocument> {
        const product = await this.productModel.findById(id).populate('categoryId').exec();
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }


    async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        let qrCode: string | undefined;
        if (updateProductDto.sku) {
            qrCode = await QRCode.toDataURL(updateProductDto.sku);
        }

        const existingProduct = await this.productModel
            .findByIdAndUpdate(id, { ...updateProductDto, ...(qrCode && { qrCode }) }, { new: true })
            .exec();
        if (!existingProduct) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return existingProduct;
    }


    async remove(id: string): Promise<Product> {
        const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
        if (!deletedProduct) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return deletedProduct;
    }

    async updateStock(productId: string, quantity: number, type: MovementType, reason?: string, performedBy?: string): Promise<Product> {
        const product = await this.findOne(productId);

        let newQuantity = product.quantity;
        if (type === MovementType.IN) {
            newQuantity += quantity;
        } else if (type === MovementType.OUT) {
            newQuantity -= quantity;
        } else if (type === MovementType.ADJUSTMENT) {
            newQuantity = quantity;
        }

        const movement = new this.movementModel({
            productId: new Types.ObjectId(productId),
            quantity,
            type,
            reason,
            performedBy,
        });
        await movement.save();

        product.quantity = newQuantity;
        const updatedProduct = await (product as any).save();

        if (newQuantity <= product.reorderPoint) {
            await this.notificationsService.create(
                'Low Stock Alert',
                `Product ${product.name} is low on stock (${newQuantity} remaining).`,
                NotificationType.WARNING,
                (product as any)._id.toString(),
            );
            this.inventoryGateway?.notifyNewNotification();
        }


        this.inventoryGateway?.notifyStockUpdate(productId, newQuantity);


        return updatedProduct;
    }
}


