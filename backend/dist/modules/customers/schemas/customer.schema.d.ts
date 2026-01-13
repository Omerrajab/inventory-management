import { Document } from 'mongoose';
export declare class Customer {
    name: string;
    phone: string;
    email: string;
    address: string;
    gstin: string;
    state: string;
    balance: number;
    isActive: boolean;
}
export type CustomerDocument = Customer & Document;
export declare const CustomerSchema: import("mongoose").Schema<Customer, import("mongoose").Model<Customer, any, any, any, (Document<unknown, any, Customer, any, import("mongoose").DefaultSchemaOptions> & Customer & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Customer, any, import("mongoose").DefaultSchemaOptions> & Customer & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Customer>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Customer, Document<unknown, {}, Customer, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Customer & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    gstin?: import("mongoose").SchemaDefinitionProperty<string, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    state?: import("mongoose").SchemaDefinitionProperty<string, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    balance?: import("mongoose").SchemaDefinitionProperty<number, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Customer>;
