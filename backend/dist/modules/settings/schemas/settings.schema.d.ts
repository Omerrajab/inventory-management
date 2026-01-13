import { Document, Types } from 'mongoose';
export declare class Settings {
    companyName: string;
    address: string;
    gstin: string;
    logoUrl: string;
    email: string;
    phone: string;
}
export type SettingsDocument = Settings & Document;
export declare const SettingsSchema: import("mongoose").Schema<Settings, import("mongoose").Model<Settings, any, any, any, (Document<unknown, any, Settings, any, import("mongoose").DefaultSchemaOptions> & Settings & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Settings, any, import("mongoose").DefaultSchemaOptions> & Settings & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Settings>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Settings, Document<unknown, {}, Settings, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Settings & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    companyName?: import("mongoose").SchemaDefinitionProperty<string, Settings, Document<unknown, {}, Settings, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Settings & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string, Settings, Document<unknown, {}, Settings, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Settings & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    gstin?: import("mongoose").SchemaDefinitionProperty<string, Settings, Document<unknown, {}, Settings, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Settings & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    logoUrl?: import("mongoose").SchemaDefinitionProperty<string, Settings, Document<unknown, {}, Settings, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Settings & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, Settings, Document<unknown, {}, Settings, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Settings & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Settings, Document<unknown, {}, Settings, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Settings & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Settings>;
export declare class Category {
    name: string;
    parentId: Types.ObjectId;
}
export type CategoryDocument = Category & Document;
export declare const CategorySchema: import("mongoose").Schema<Category, import("mongoose").Model<Category, any, any, any, (Document<unknown, any, Category, any, import("mongoose").DefaultSchemaOptions> & Category & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Category, any, import("mongoose").DefaultSchemaOptions> & Category & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Category>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Category, Document<unknown, {}, Category, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Category & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Category, Document<unknown, {}, Category, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Category & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    parentId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Category, Document<unknown, {}, Category, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Category & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Category>;
