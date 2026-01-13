import { SalesService } from './sales.service';
import { BillingService } from '../billing/billing.service';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
export declare class SalesController {
    private readonly salesService;
    private readonly billingService;
    constructor(salesService: SalesService, billingService: BillingService);
    create(createSaleDto: any): Promise<import("./schemas/sale.schema").Sale>;
    findAll(query: PaginationQueryDto): Promise<any>;
    findOne(id: string): Promise<import("./schemas/sale.schema").Sale | null>;
    getInvoice(id: string, res: any): Promise<any>;
}
