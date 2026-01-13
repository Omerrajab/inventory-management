import { Document, Types } from 'mongoose';
export declare class SaleItem {
    productId: Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
    gstRate: number;
    gstAmount: number;
    subtotal: number;
}
export declare enum PaymentStatus {
    PAID = "PAID",
    PENDING = "PENDING",
    PARTIAL = "PARTIAL"
}
export declare enum PaymentMethod {
    CASH = "CASH",
    CARD = "CARD",
    TRANSFER = "TRANSFER",
    CREDIT = "CREDIT"
}
export declare class Sale {
    customerId?: Types.ObjectId;
    items: SaleItem[];
    totalAmount: number;
    taxAmount: number;
    cgst: number;
    sgst: number;
    igst: number;
    discountAmount: number;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    invoiceNumber: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
export type SaleDocument = Sale & Document;
export declare const SaleSchema: import("mongoose").Schema<Sale, import("mongoose").Model<Sale, any, any, any, (Document<unknown, any, Sale, any, import("mongoose").DefaultSchemaOptions> & Sale & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Sale, any, import("mongoose").DefaultSchemaOptions> & Sale & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Sale>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Sale, Document<unknown, {}, Sale, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Sale & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    customerId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    items?: import("mongoose").SchemaDefinitionProperty<SaleItem[], Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalAmount?: import("mongoose").SchemaDefinitionProperty<number, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    taxAmount?: import("mongoose").SchemaDefinitionProperty<number, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cgst?: import("mongoose").SchemaDefinitionProperty<number, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sgst?: import("mongoose").SchemaDefinitionProperty<number, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    igst?: import("mongoose").SchemaDefinitionProperty<number, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    discountAmount?: import("mongoose").SchemaDefinitionProperty<number, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    paymentStatus?: import("mongoose").SchemaDefinitionProperty<PaymentStatus, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    paymentMethod?: import("mongoose").SchemaDefinitionProperty<PaymentMethod, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    invoiceNumber?: import("mongoose").SchemaDefinitionProperty<string, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    updatedAt?: import("mongoose").SchemaDefinitionProperty<Date, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Sale>;
