export enum NotificationType {
    INFO = 'INFO',
    WARNING = 'WARNING',
    DANGER = 'DANGER',
}

export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: NotificationType;
    read: boolean;
    relatedId?: string;
    createdAt: string;
}
