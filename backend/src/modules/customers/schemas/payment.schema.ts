import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum PaymentMethod {
    CASH = 'CASH',
    CARD = 'CARD',
    TRANSFER = 'TRANSFER',
    UPI = 'UPI',
    CHEQUE = 'CHEQUE',
}

@Schema({ timestamps: true })
export class CustomerPayment {
    @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
    customerId: Types.ObjectId;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, enum: PaymentMethod, default: PaymentMethod.CASH })
    method: PaymentMethod;

    @Prop()
    transactionId: string;

    @Prop()
    notes: string;
}

export type CustomerPaymentDocument = CustomerPayment & Document;
export const CustomerPaymentSchema = SchemaFactory.createForClass(CustomerPayment);
