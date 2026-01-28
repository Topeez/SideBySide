"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
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

        // Realtime odběr (Subscribe)
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

    // 2. Označení jako přečtené (všechny najednou po otevření)
    const markAllAsRead = async () => {
        if (unreadCount === 0) return;

        // Optimisticky aktualizovat UI
        const updatedNotifs = notifications.map((n) => ({
            ...n,
            is_read: true,
        }));
        setNotifications(updatedNotifs);
        setUnreadCount(0);

        // Poslat do DB
        await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("user_id", userId)
            .eq("is_read", false);
    };

    // Handler pro otevření
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            markAllAsRead();
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative border border-muted rounded-full text-muted-foreground hover:text-white rounde"
                >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="top-1 right-1 absolute flex w-2.5 h-2.5">
                            <span className="inline-flex absolute bg-red-400 opacity-75 rounded-full w-full h-full animate-ping"></span>
                            <span className="inline-flex relative bg-red-500 rounded-full w-2.5 h-2.5"></span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="shadow-lg mr-4 p-0 border-muted rounded-lg w-80"
                align="end"
            >
                {/* Hlavička */}
                <div className="flex justify-between items-center bg-muted px-4 py-3 border-b rounded-t-lg">
                    <h4 className="font-semibold text-sm">Oznámení</h4>
                    {unreadCount > 0 && (
                        <span className="text-muted-foreground text-xs">
                            {unreadCount} nových
                        </span>
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
                                        "flex flex-col gap-1 hover:bg-stone-50 p-4 text-left transition-colors",
                                        !notification.is_read &&
                                            "bg-secondary/5",
                                    )}
                                    onClick={() => setIsOpen(false)} // Zavřít po kliknutí
                                >
                                    <div className="flex justify-between items-start">
                                        <span
                                            className={cn(
                                                "font-medium text-sm",
                                                !notification.is_read &&
                                                    "text-secondary font-bold",
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
                                    <p className="text-muted-foreground text-xs line-clamp-2">
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
