"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react"; // Přidán Trash2
import { createClient } from "@/utils/supabase/client";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { cs } from "date-fns/locale";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Typ pro notifikaci podle DB schématu
type Notification = {
    id: string;
    created_at: string;
    title: string;
    message: string;
    link: string | null;
    is_read: boolean;
    type?: string;
};

export function NotificationsBell({ userId }: { userId: string }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const supabase = createClient();

    // 1. Načtení a Realtime
    useEffect(() => {
        const fetchNotifications = async () => {
            const { data } = await supabase
                .from("notifications")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })
                .limit(20);

            if (data) {
                setNotifications(data);
                setUnreadCount(data.filter((n) => !n.is_read).length);
            }
        };

        fetchNotifications();

        const channel = supabase
            .channel("realtime-notifications")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications",
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    const newNotif = payload.new as Notification;
                    setNotifications((prev) => [newNotif, ...prev]);
                    setUnreadCount((prev) => prev + 1);
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, supabase]);

    // 2. Označení JEDNÉ notifikace
    const markAsRead = async (notificationId: string) => {
        const notification = notifications.find((n) => n.id === notificationId);
        if (notification?.is_read) return;

        setNotifications((prev) =>
            prev.map((n) =>
                n.id === notificationId ? { ...n, is_read: true } : n,
            ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("id", notificationId)
            .eq("user_id", userId);
    };

    // 3. Označení VŠECH
    const markAllAsRead = async () => {
        if (unreadCount === 0) return;

        const updatedNotifs = notifications.map((n) => ({
            ...n,
            is_read: true,
        }));
        setNotifications(updatedNotifs);
        setUnreadCount(0);

        await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("user_id", userId)
            .eq("is_read", false);
    };

    // 4. SMAZÁNÍ Notifikace (NOVÉ)
    const deleteNotification = async (
        e: React.MouseEvent,
        notificationId: string,
    ) => {
        // Zabráníme prokliku na odkaz (Link) při kliknutí na koš
        e.preventDefault();
        e.stopPropagation();

        // Zjistíme, jestli mazaná zpráva byla nepřečtená (abychom snížili počítadlo)
        const wasUnread =
            notifications.find((n) => n.id === notificationId)?.is_read ===
            false;

        // UI Update (odstraníme ze seznamu)
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

        if (wasUnread) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        // DB Delete
        const { error } = await supabase
            .from("notifications")
            .delete()
            .eq("id", notificationId)
            .eq("user_id", userId);

        if (error) {
            console.error("Chyba při mazání:", error);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative border border-muted rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
                >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="top-0 right-0 absolute flex size-2.5 -translate-y-0.5 translate-x-0.5">
                            <span className="inline-flex absolute bg-secondary/75 rounded-full size-full animate-ping"></span>
                            <span className="inline-flex relative bg-secondary rounded-full size-2.5"></span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="shadow-lg mr-4 p-0 border-muted rounded-lg w-80"
                align="center"
            >
                {/* Hlavička */}
                <div className="flex justify-between items-center bg-muted/50 px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">Oznámení</h4>
                        {unreadCount > 0 && (
                            <span className="bg-secondary/10 px-1.5 py-0.5 rounded-full font-medium text-[10px] text-secondary">
                                {unreadCount} nových
                            </span>
                        )}
                    </div>

                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-auto text-muted-foreground hover:text-foreground text-xs"
                            onClick={markAllAsRead}
                            title="Označit vše jako přečtené"
                        >
                            <CheckCheck className="mr-1 w-3 h-3" />
                            Přečíst vše
                        </Button>
                    )}
                </div>

                {/* Seznam */}
                <ScrollArea className="h-75">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col justify-center items-center space-y-2 h-40 text-muted-foreground">
                            <Bell className="opacity-20 size-8" />
                            <p className="text-sm">Žádná nová oznámení</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <Link
                                    key={notification.id}
                                    href={notification.link || "#"}
                                    className={cn(
                                        "group relative flex flex-col gap-1 hover:bg-muted/50 p-4 text-left transition-colors",
                                        !notification.is_read &&
                                            "bg-secondary/5",
                                    )}
                                    onClick={() => {
                                        markAsRead(notification.id);
                                        setIsOpen(false);
                                    }}
                                >
                                    {/* Indikátor nepřečteného */}
                                    {!notification.is_read && (
                                        <span className="top-4 left-2 absolute bg-secondary rounded-full w-1.5 h-1.5" />
                                    )}

                                    {/* Tlačítko SMAZAT (Zobrazí se jen při hoveru na skupinu) */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="top-2 right-2 absolute hover:bg-red-50 opacity-0 group-hover:opacity-100 w-6 h-6 text-muted-foreground hover:text-destructive transition-all duration-200"
                                        onClick={(e) =>
                                            deleteNotification(
                                                e,
                                                notification.id,
                                            )
                                        }
                                        title="Smazat upozornění"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>

                                    <div
                                        className={cn(
                                            "flex justify-between items-start pr-6",
                                            !notification.is_read ? "pl-2" : "",
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "font-medium text-sm",
                                                !notification.is_read &&
                                                    "text-secondary-foreground",
                                            )}
                                        >
                                            {notification.title}
                                        </span>
                                        <span className="ml-2 text-[10px] text-muted-foreground whitespace-nowrap">
                                            {formatDistanceToNow(
                                                new Date(
                                                    notification.created_at,
                                                ),
                                                {
                                                    addSuffix: true,
                                                    locale: cs,
                                                },
                                            )}
                                        </span>
                                    </div>
                                    <p
                                        className={cn(
                                            "text-muted-foreground text-xs line-clamp-2",
                                            !notification.is_read ? "pl-2" : "",
                                        )}
                                    >
                                        {notification.message}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
