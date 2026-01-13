import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Customer {
    @Prop({ required: true })
    name: string;

    @Prop()
    phone: string;

    @Prop()
    email: string;

    @Prop()
    address: string;

    @Prop()
    gstin: string;

    @Prop()
    state: string; // Required for IGST vs CGST/SGST calculation

    @Prop({ default: 0 })
    balance: number;

    @Prop({ default: true })
    isActive: boolean;
}


export type CustomerDocument = Customer & Document;
export const CustomerSchema = SchemaFactory.createForClass(Customer);
