import { Document, Types } from 'mongoose';
export declare enum LedgerEntryType {
    SALE = "SALE",
    PAYMENT = "PAYMENT",
    RETURN = "RETURN",
    ADJUSTMENT = "ADJUSTMENT"
}
export declare class CustomerLedger {
    customerId: Types.ObjectId;
    type: LedgerEntryType;
    amount: number;
    balanceAfter: number;
    referenceId: string;
    description: string;
}
export type CustomerLedgerDocument = CustomerLedger & Document;
export declare const CustomerLedgerSchema: import("mongoose").Schema<CustomerLedger, import("mongoose").Model<CustomerLedger, any, any, any, (Document<unknown, any, CustomerLedger, any, import("mongoose").DefaultSchemaOptions> & CustomerLedger & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, CustomerLedger, any, import("mongoose").DefaultSchemaOptions> & CustomerLedger & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, CustomerLedger>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CustomerLedger, Document<unknown, {}, CustomerLedger, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<CustomerLedger & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    customerId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, CustomerLedger, Document<unknown, {}, CustomerLedger, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<CustomerLedger & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<LedgerEntryType, CustomerLedger, Document<unknown, {}, CustomerLedger, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<CustomerLedger & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, CustomerLedger, Document<unknown, {}, CustomerLedger, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<CustomerLedger & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    balanceAfter?: import("mongoose").SchemaDefinitionProperty<number, CustomerLedger, Document<unknown, {}, CustomerLedger, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<CustomerLedger & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    referenceId?: import("mongoose").SchemaDefinitionProperty<string, CustomerLedger, Document<unknown, {}, CustomerLedger, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<CustomerLedger & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, CustomerLedger, Document<unknown, {}, CustomerLedger, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<CustomerLedger & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, CustomerLedger>;
