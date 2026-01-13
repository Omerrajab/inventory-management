"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { Notification, NotificationType } from "@/types/notifications";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export function NotificationCenter() {
    const queryClient = useQueryClient();

    const { data: notifications = [] } = useQuery<Notification[]>({
        queryKey: ["notifications"],
        queryFn: async () => {
            const response = await apiClient.get("/notifications");
            return response.data;
        },
        refetchInterval: 30000, // Still refetch every 30s as fallback
    });

    const { data: unreadCount = 0 } = useQuery<number>({
        queryKey: ["notifications", "unread-count"],
        queryFn: async () => {
            const response = await apiClient.get("/notifications/unread-count");
            return response.data;
        },
    });

    const markAsRead = useMutation({
        mutationFn: (id: string) => apiClient.patch(`/notifications/${id}/read`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const markAllAsRead = useMutation({
        mutationFn: () => apiClient.post("/notifications/read-all"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case NotificationType.WARNING:
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            case NotificationType.DANGER:
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            case NotificationType.INFO:
            default:
                return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[350px]">
                <div className="flex items-center justify-between p-4 bg-muted/50">
                    <h4 className="text-sm font-semibold">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                            onClick={() => markAllAsRead.mutate()}
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[350px]">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            No notifications yet.
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification._id}
                                className={cn(
                                    "flex flex-col items-start p-4 gap-1 cursor-default focus:bg-muted/50",
                                    !notification.read && "bg-primary/5"
                                )}
                                onClick={() => !notification.read && markAsRead.mutate(notification._id)}
                            >
                                <div className="flex items-center gap-2 w-full">
                                    {getIcon(notification.type)}
                                    <span className="text-sm font-medium flex-1">{notification.title}</span>
                                    {!notification.read && (
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {notification.message}
                                </p>
                                <span className="text-[10px] text-muted-foreground mt-1">
                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </span>
                            </DropdownMenuItem>
                        ))
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
