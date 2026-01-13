import { Document, Types } from 'mongoose';
export type StockMovementDocument = StockMovement & Document;
export declare enum MovementType {
    IN = "IN",
    OUT = "OUT",
    ADJUSTMENT = "ADJUSTMENT",
    TRANSFER = "TRANSFER"
}
export declare class StockMovement {
    productId: Types.ObjectId;
    quantity: number;
    type: MovementType;
    fromLocation: string;
    toLocation: string;
    reason: string;
    performedBy: string;
}
export declare const StockMovementSchema: import("mongoose").Schema<StockMovement, import("mongoose").Model<StockMovement, any, any, any, (Document<unknown, any, StockMovement, any, import("mongoose").DefaultSchemaOptions> & StockMovement & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, StockMovement, any, import("mongoose").DefaultSchemaOptions> & StockMovement & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, StockMovement>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StockMovement, Document<unknown, {}, StockMovement, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<StockMovement & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    productId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, StockMovement, Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<StockMovement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    quantity?: import("mongoose").SchemaDefinitionProperty<number, StockMovement, Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<StockMovement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<MovementType, StockMovement, Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<StockMovement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    fromLocation?: import("mongoose").SchemaDefinitionProperty<string, StockMovement, Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<StockMovement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    toLocation?: import("mongoose").SchemaDefinitionProperty<string, StockMovement, Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<StockMovement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reason?: import("mongoose").SchemaDefinitionProperty<string, StockMovement, Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<StockMovement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    performedBy?: import("mongoose").SchemaDefinitionProperty<string, StockMovement, Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<StockMovement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, StockMovement>;
