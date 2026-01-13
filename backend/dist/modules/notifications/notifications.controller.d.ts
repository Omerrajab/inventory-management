import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(): Promise<import("./schemas/notification.schema").Notification[]>;
    getUnreadCount(): Promise<number>;
    markAsRead(id: string): Promise<import("./schemas/notification.schema").Notification | null>;
    markAllAsRead(): Promise<void>;
}
