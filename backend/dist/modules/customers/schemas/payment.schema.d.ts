import { Document, Types } from 'mongoose';
export declare enum PaymentMethod {
    CASH = "CASH",
    CARD = "CARD",
    TRANSFER = "TRANSFER",
    UPI = "UPI",
    CHEQUE = "CHEQUE"
}
export declare class CustomerPayment {
    customerId: Types.ObjectId;
    amount: number;
    method: PaymentMethod;
    transactionId: string;
    notes: string;
}
export type CustomerPaymentDocument = CustomerPayment & Document;
export declare const CustomerPaymentSchema: import("mongoose").Schema<CustomerPayment, import("mongoose").Model<CustomerPayment, any, any, any, (Document<unknown, any, CustomerPayment, any, import("mongoose").DefaultSchemaOptions> & CustomerPayment & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, CustomerPayment, any, import("mongoose").DefaultSchemaOptions> & CustomerPayment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, CustomerPayment>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CustomerPayment, Document<unknown, {}, CustomerPayment, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<CustomerPayment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    customerId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, CustomerPayment, Document<unknown, {}, CustomerPayment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<CustomerPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, CustomerPayment, Document<unknown, {}, CustomerPayment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<CustomerPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    method?: import("mongoose").SchemaDefinitionProperty<PaymentMethod, CustomerPayment, Document<unknown, {}, CustomerPayment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<CustomerPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    transactionId?: import("mongoose").SchemaDefinitionProperty<string, CustomerPayment, Document<unknown, {}, CustomerPayment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<CustomerPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string, CustomerPayment, Document<unknown, {}, CustomerPayment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<CustomerPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, CustomerPayment>;
