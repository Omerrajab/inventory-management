import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class SaleItem {
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    productId: Types.ObjectId;

    @Prop({ required: true })
    name: string; // SKU or Name snapshot at time of sale

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    price: number; // Unit price

    @Prop({ default: 0 })
    gstRate: number;

    @Prop({ default: 0 })
    gstAmount: number;

    @Prop({ required: true })
    subtotal: number; // (price * quantity) + gstAmount
}

export enum PaymentStatus {
    PAID = 'PAID',
    PENDING = 'PENDING',
    PARTIAL = 'PARTIAL',
}

export enum PaymentMethod {
    CASH = 'CASH',
    CARD = 'CARD',
    TRANSFER = 'TRANSFER',
    CREDIT = 'CREDIT',
}

@Schema({ timestamps: true })
export class Sale {
    @Prop({ type: Types.ObjectId, ref: 'Customer' })
    customerId?: Types.ObjectId;

    @Prop({ type: [SaleItem], required: true })
    items: SaleItem[];

    @Prop({ required: true })
    totalAmount: number;

    @Prop({ default: 0 })
    taxAmount: number; // Total GST

    @Prop({ default: 0 })
    cgst: number;

    @Prop({ default: 0 })
    sgst: number;

    @Prop({ default: 0 })
    igst: number;

    @Prop({ default: 0 })
    discountAmount: number;

    @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PAID })
    paymentStatus: PaymentStatus;

    @Prop({ enum: PaymentMethod, default: PaymentMethod.CASH })
    paymentMethod: PaymentMethod;

    @Prop()
    invoiceNumber: string;

    @Prop()
    notes: string;

    createdAt: Date;
    updatedAt: Date;
}



export type SaleDocument = Sale & Document;
export const SaleSchema = SchemaFactory.createForClass(Sale);
