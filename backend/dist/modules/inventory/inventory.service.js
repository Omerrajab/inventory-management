"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
const stock_movement_schema_1 = require("./schemas/stock-movement.schema");
const inventory_gateway_1 = require("./inventory.gateway");
const QRCode = __importStar(require("qrcode"));
const notifications_service_1 = require("../notifications/notifications.service");
const notification_schema_1 = require("../notifications/schemas/notification.schema");
let InventoryService = class InventoryService {
    productModel;
    movementModel;
    inventoryGateway;
    notificationsService;
    constructor(productModel, movementModel, inventoryGateway, notificationsService) {
        this.productModel = productModel;
        this.movementModel = movementModel;
        this.inventoryGateway = inventoryGateway;
        this.notificationsService = notificationsService;
    }
    async create(createProductDto) {
        const qrCode = await QRCode.toDataURL(createProductDto.sku);
        const createdProduct = new this.productModel({ ...createProductDto, qrCode });
        return createdProduct.save();
    }
    async findAll(query = {}) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (page - 1) * limit;
        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
            ];
        }
        const sort = {};
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
    async findOne(id) {
        const product = await this.productModel.findById(id).populate('categoryId').exec();
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async update(id, updateProductDto) {
        let qrCode;
        if (updateProductDto.sku) {
            qrCode = await QRCode.toDataURL(updateProductDto.sku);
        }
        const existingProduct = await this.productModel
            .findByIdAndUpdate(id, { ...updateProductDto, ...(qrCode && { qrCode }) }, { new: true })
            .exec();
        if (!existingProduct) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return existingProduct;
    }
    async remove(id) {
        const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
        if (!deletedProduct) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return deletedProduct;
    }
    async updateStock(productId, quantity, type, reason, performedBy) {
        const product = await this.findOne(productId);
        let newQuantity = product.quantity;
        if (type === stock_movement_schema_1.MovementType.IN) {
            newQuantity += quantity;
        }
        else if (type === stock_movement_schema_1.MovementType.OUT) {
            newQuantity -= quantity;
        }
        else if (type === stock_movement_schema_1.MovementType.ADJUSTMENT) {
            newQuantity = quantity;
        }
        const movement = new this.movementModel({
            productId: new mongoose_2.Types.ObjectId(productId),
            quantity,
            type,
            reason,
            performedBy,
        });
        await movement.save();
        product.quantity = newQuantity;
        const updatedProduct = await product.save();
        if (newQuantity <= product.reorderPoint) {
            await this.notificationsService.create('Low Stock Alert', `Product ${product.name} is low on stock (${newQuantity} remaining).`, notification_schema_1.NotificationType.WARNING, product._id.toString());
            this.inventoryGateway?.notifyNewNotification();
        }
        this.inventoryGateway?.notifyStockUpdate(productId, newQuantity);
        return updatedProduct;
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(stock_movement_schema_1.StockMovement.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        inventory_gateway_1.InventoryGateway,
        notifications_service_1.NotificationsService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map