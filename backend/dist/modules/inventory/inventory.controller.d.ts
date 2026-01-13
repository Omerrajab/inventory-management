import { InventoryService } from './inventory.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MovementType } from './schemas/stock-movement.schema';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    create(createProductDto: CreateProductDto): Promise<import("./schemas/product.schema").Product>;
    findAll(query: PaginationQueryDto): Promise<any>;
    findOne(id: string): Promise<import("./schemas/product.schema").ProductDocument>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("./schemas/product.schema").Product>;
    remove(id: string): Promise<import("./schemas/product.schema").Product>;
    updateStock(id: string, quantity: number, type: MovementType, reason?: string, performedBy?: string): Promise<import("./schemas/product.schema").Product>;
}
