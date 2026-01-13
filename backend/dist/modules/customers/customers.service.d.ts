import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CustomerLedger, CustomerLedgerDocument, LedgerEntryType } from './schemas/ledger.schema';
import { CustomerPayment, CustomerPaymentDocument } from './schemas/payment.schema';
export declare class CustomersService {
    private customerModel;
    private ledgerModel;
    private paymentModel;
    constructor(customerModel: Model<CustomerDocument>, ledgerModel: Model<CustomerLedgerDocument>, paymentModel: Model<CustomerPaymentDocument>);
    create(createCustomerDto: any): Promise<Customer>;
    findAll(query?: any): Promise<any>;
    findOne(id: string): Promise<CustomerDocument>;
    recordLedgerEntry(customerId: string, type: LedgerEntryType, amount: number, referenceId?: string, description?: string): Promise<import("mongoose").Document<unknown, {}, CustomerLedgerDocument, {}, import("mongoose").DefaultSchemaOptions> & CustomerLedger & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    recordPayment(paymentDto: any): Promise<import("mongoose").Document<unknown, {}, CustomerPaymentDocument, {}, import("mongoose").DefaultSchemaOptions> & CustomerPayment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getLedger(customerId: string): Promise<(import("mongoose").Document<unknown, {}, CustomerLedgerDocument, {}, import("mongoose").DefaultSchemaOptions> & CustomerLedger & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    update(id: string, updateCustomerDto: any): Promise<Customer>;
    remove(id: string): Promise<Customer>;
}
