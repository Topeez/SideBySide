export type Notification = {
    id: string;
    created_at: string;
    title: string;
    message: string;
    link: string | null;
    is_read: boolean;
    type?: string;
};

export interface NotificationsBellProps {
    userId: string;
}

export interface NotificationItemProps {
    notification: Notification;
    onRead: (id: string) => void;
    onDelete: (e: React.MouseEvent, id: string) => void;
    onClose: () => void;
}
