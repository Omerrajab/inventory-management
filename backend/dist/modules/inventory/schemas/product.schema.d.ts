import { Document, Types } from 'mongoose';
export type ProductDocument = Product & Document;
export declare class Product {
    name: string;
    sku: string;
    description: string;
    categoryId: Types.ObjectId;
    purchasePrice: number;
    price: number;
    hsnCode: string;
    gstRate: number;
    qrCode: string;
    barCode: string;
    minStockLevel: number;
    maxStockLevel: number;
    quantity: number;
    reorderPoint: number;
    unit: string;
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, (Document<unknown, any, Product, any, import("mongoose").DefaultSchemaOptions> & Product & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Product, any, import("mongoose").DefaultSchemaOptions> & Product & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Product>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, Product, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Product & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sku?: import("mongoose").SchemaDefinitionProperty<string, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    categoryId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    purchasePrice?: import("mongoose").SchemaDefinitionProperty<number, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    price?: import("mongoose").SchemaDefinitionProperty<number, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    hsnCode?: import("mongoose").SchemaDefinitionProperty<string, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    gstRate?: import("mongoose").SchemaDefinitionProperty<number, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    qrCode?: import("mongoose").SchemaDefinitionProperty<string, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    barCode?: import("mongoose").SchemaDefinitionProperty<string, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    minStockLevel?: import("mongoose").SchemaDefinitionProperty<number, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    maxStockLevel?: import("mongoose").SchemaDefinitionProperty<number, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    quantity?: import("mongoose").SchemaDefinitionProperty<number, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reorderPoint?: import("mongoose").SchemaDefinitionProperty<number, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    unit?: import("mongoose").SchemaDefinitionProperty<string, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Product>;
