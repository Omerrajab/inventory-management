import { Model } from 'mongoose';
import { Sale, SaleDocument } from './schemas/sale.schema';
import { InventoryService } from '../inventory/inventory.service';
import { CustomersService } from '../customers/customers.service';
export declare class SalesService {
    private saleModel;
    private readonly inventoryService;
    private readonly customersService;
    constructor(saleModel: Model<SaleDocument>, inventoryService: InventoryService, customersService: CustomersService);
    create(createSaleDto: any): Promise<Sale>;
    findAll(query?: any): Promise<any>;
    findOne(id: string): Promise<Sale | null>;
}
