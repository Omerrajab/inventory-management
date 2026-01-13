import { Model } from 'mongoose';
import { Notification, NotificationDocument, NotificationType } from './schemas/notification.schema';
export declare class NotificationsService {
    private notificationModel;
    constructor(notificationModel: Model<NotificationDocument>);
    create(title: string, message: string, type: NotificationType, relatedId?: string): Promise<Notification>;
    findAll(): Promise<Notification[]>;
    markAsRead(id: string): Promise<Notification | null>;
    markAllAsRead(): Promise<void>;
    getUnreadCount(): Promise<number>;
}
