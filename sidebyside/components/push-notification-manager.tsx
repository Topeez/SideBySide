"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { saveSubscription } from "@/app/actions/push";
import { toast } from "sonner";
import ActionButton from "./action-button";

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function PushNotificationManager() {
    const [isSupported, setIsSupported] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(
        null,
    );
    const [loading, setLoading] = useState(true);

    async function syncSubscriptionToDb(sub: PushSubscription) {
        // Pro jistotu pošleme do DB znovu (upsert to vyřeší)
        const result = await saveSubscription(JSON.parse(JSON.stringify(sub)));
        if (!result.success) {
            console.error("Failed to sync sub to DB:", result.error);
        }
    }

    async function registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register(
                "/sw.js",
                {
                    scope: "/",
                    updateViaCache: "none",
                },
            );

            const sub = await registration.pushManager.getSubscription();
            setSubscription(sub);

            // OPRAVA: Pokud existuje lokální odběr, ujistíme se, že je i v DB
            if (sub) {
                await syncSubscriptionToDb(sub);
            }
        } catch (error) {
            console.error("Service Worker Error", error);
        } finally {
            setLoading(false);
        }
    }

    async function subscribeToPush() {
        setLoading(true);
        try {
            const registration = await navigator.serviceWorker.ready;

            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
                ),
            });

            setSubscription(sub);
            await syncSubscriptionToDb(sub);
            toast.success("Oznámení zapnuta!");
        } catch (error) {
            console.error("Subscription failed", error);
            toast.error("Nepodařilo se zapnout oznámení.");
        } finally {
            setLoading(false);
        }
    }

    async function unsubscribeFromPush() {
        setLoading(true);
        try {
            if (subscription) {
                await subscription.unsubscribe(); // Odhlásit v prohlížeči
                setSubscription(null);
                // Tady bychom ideálně měli zavolat i server action pro smazání z DB,
                // ale pro teď stačí, že server při příštím pokusu o odeslání zjistí chybu 410 a smaže to sám.
                toast.success("Oznámení vypnuta.");
            }
        } catch (error) {
            console.error("Unsubscribe failed", error);
            toast.error("Chyba při vypínání.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const init = async () => {
            if ("serviceWorker" in navigator && "PushManager" in window) {
                setIsSupported(true);
                await registerServiceWorker();
            } else {
                setLoading(false);
            }
        };
        init();
    }, []);

    if (!isSupported) return null;

    return (
        <div className="flex justify-between items-center text-card-foreground">
            <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full text-primary">
                    {subscription ? (
                        <Bell className="size-5" />
                    ) : (
                        <BellOff className="size-5" />
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="font-medium">Push Oznámení</span>
                    <span className="text-muted-foreground text-xs">
                        {subscription
                            ? "Notifikace jsou aktivní."
                            : "Povol oznámení, ať ti nic neuteče."}
                    </span>
                </div>
            </div>

            {loading ? (
                <ActionButton variant="ghost" size="sm" disabled>
                    <Loader2 className="size-4 animate-spin" />
                </ActionButton>
            ) : subscription ? (
                <ActionButton
                    onClick={unsubscribeFromPush}
                    variant="outline"
                    size="sm"
                    className="hover:bg-red-50 border-red-200 text-red-600 hover:text-red-700"
                >
                    Vypnout
                </ActionButton>
            ) : (
                <ActionButton onClick={subscribeToPush} size="sm">
                    Zapnout
                </ActionButton>
            )}
        </div>
    );
}
