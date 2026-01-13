import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum LedgerEntryType {
    SALE = 'SALE',
    PAYMENT = 'PAYMENT',
    RETURN = 'RETURN',
    ADJUSTMENT = 'ADJUSTMENT',
}

@Schema({ timestamps: true })
export class CustomerLedger {
    @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
    customerId: Types.ObjectId;

    @Prop({ required: true, enum: LedgerEntryType })
    type: LedgerEntryType;

    @Prop({ required: true })
    amount: number; // Positive for Debit (Increase Balance), Negative for Credit (Decrease Balance)

    @Prop({ required: true })
    balanceAfter: number;

    @Prop()
    referenceId: string; // Sale ID, Payment ID, etc.

    @Prop()
    description: string;
}

export type CustomerLedgerDocument = CustomerLedger & Document;
export const CustomerLedgerSchema = SchemaFactory.createForClass(CustomerLedger);
