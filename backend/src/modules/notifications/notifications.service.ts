import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument, NotificationType } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    ) { }

    async create(title: string, message: string, type: NotificationType, relatedId?: string): Promise<Notification> {
        const notification = new this.notificationModel({
            title,
            message,
            type,
            relatedId,
        });
        return notification.save();
    }

    async findAll(): Promise<Notification[]> {
        return this.notificationModel.find().sort({ createdAt: -1 }).limit(50).exec();
    }

    async markAsRead(id: string): Promise<Notification | null> {
        return this.notificationModel.findByIdAndUpdate(id, { read: true }, { new: true }).exec();
    }

    async markAllAsRead(): Promise<void> {
        await this.notificationModel.updateMany({ read: false }, { read: true }).exec();
    }

    async getUnreadCount(): Promise<number> {
        return this.notificationModel.countDocuments({ read: false }).exec();
    }
}
