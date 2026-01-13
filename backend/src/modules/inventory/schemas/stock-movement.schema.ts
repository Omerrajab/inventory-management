import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StockMovementDocument = StockMovement & Document;

export enum MovementType {
    IN = 'IN',
    OUT = 'OUT',
    ADJUSTMENT = 'ADJUSTMENT',
    TRANSFER = 'TRANSFER',
}

@Schema({ timestamps: true })
export class StockMovement {
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    productId: Types.ObjectId;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true, enum: MovementType })
    type: MovementType;

    @Prop()
    fromLocation: string;

    @Prop()
    toLocation: string;

    @Prop()
    reason: string;

    @Prop()
    performedBy: string; // User ID or name
}

export const StockMovementSchema = SchemaFactory.createForClass(StockMovement);
