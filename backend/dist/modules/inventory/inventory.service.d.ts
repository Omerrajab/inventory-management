import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { StockMovementDocument, MovementType } from './schemas/stock-movement.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InventoryGateway } from './inventory.gateway';
import { NotificationsService } from '../notifications/notifications.service';
export declare class InventoryService {
    private productModel;
    private movementModel;
    private readonly inventoryGateway;
    private readonly notificationsService;
    constructor(productModel: Model<ProductDocument>, movementModel: Model<StockMovementDocument>, inventoryGateway: InventoryGateway, notificationsService: NotificationsService);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(query?: any): Promise<any>;
    findOne(id: string): Promise<ProductDocument>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<Product>;
    updateStock(productId: string, quantity: number, type: MovementType, reason?: string, performedBy?: string): Promise<Product>;
}
