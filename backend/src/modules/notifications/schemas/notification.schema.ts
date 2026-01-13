import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum NotificationType {
    INFO = 'INFO',
    WARNING = 'WARNING',
    DANGER = 'DANGER',
}

@Schema({ timestamps: true })
export class Notification {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    message: string;

    @Prop({ required: true, enum: NotificationType, default: NotificationType.INFO })
    type: NotificationType;

    @Prop({ default: false })
    read: boolean;

    @Prop({ type: Types.ObjectId, ref: 'Product' })
    relatedId?: Types.ObjectId;
}

export type NotificationDocument = Notification & Document;
export const NotificationSchema = SchemaFactory.createForClass(Notification);
