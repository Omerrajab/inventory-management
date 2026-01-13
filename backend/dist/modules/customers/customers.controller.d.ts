import { CustomersService } from './customers.service';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: any): Promise<import("./schemas/customer.schema").Customer>;
    findAll(query: PaginationQueryDto): Promise<any>;
    findOne(id: string): Promise<import("./schemas/customer.schema").CustomerDocument>;
    update(id: string, updateCustomerDto: any): Promise<import("./schemas/customer.schema").Customer>;
    remove(id: string): Promise<import("./schemas/customer.schema").Customer>;
    recordPayment(paymentDto: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/payment.schema").CustomerPaymentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payment.schema").CustomerPayment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getLedger(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/ledger.schema").CustomerLedgerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/ledger.schema").CustomerLedger & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
