import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    sku: string;

    @Prop()
    description: string;

    @Prop({ type: Types.ObjectId, ref: 'Category' })
    categoryId: Types.ObjectId;

    @Prop({ default: 0 })
    purchasePrice: number;

    @Prop({ required: true })
    price: number; // Base price without GST


    @Prop()
    hsnCode: string;

    @Prop({ default: 18 }) // Most common GST rate
    gstRate: number; // e.g., 5, 12, 18, 28


    @Prop()
    qrCode: string;

    @Prop()
    barCode: string;

    @Prop({ default: 0 })
    minStockLevel: number;

    @Prop()
    maxStockLevel: number;

    @Prop({ default: 0 })
    quantity: number;

    @Prop({ default: 0 })
    reorderPoint: number;

    @Prop()
    unit: string; // e.g., 'pcs', 'kg'
}

export const ProductSchema = SchemaFactory.createForClass(Product);
