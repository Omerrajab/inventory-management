import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Settings {
    @Prop({ required: true, default: 'ANTIGRAVITY INVENTORY' })
    companyName: string;

    @Prop({ required: true, default: '123 Modern Tech Park, Hinjewadi, Pune, Maharashtra - 411057' })
    address: string;

    @Prop({ required: true, default: '27AAAAA0000A1Z5' })
    gstin: string;

    @Prop()
    logoUrl: string;

    @Prop()
    email: string;

    @Prop()
    phone: string;
}

export type SettingsDocument = Settings & Document;
export const SettingsSchema = SchemaFactory.createForClass(Settings);

@Schema({ timestamps: true })
export class Category {
    @Prop({ required: true })
    name: string;

    @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
    parentId: Types.ObjectId;
}

export type CategoryDocument = Category & Document;
export const CategorySchema = SchemaFactory.createForClass(Category);
