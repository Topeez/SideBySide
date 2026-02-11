"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import webPush, { WebPushError } from "web-push";


// Konfigurace web-push
webPush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// 1. Uložení odběru do DB
export async function saveSubscription(sub: PushSubscriptionJSON) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("push_subscriptions").upsert({
    user_id: user.id,
    endpoint: sub.endpoint,
    p256dh: sub.keys?.p256dh,
    auth: sub.keys?.auth,
  }, { onConflict: 'user_id, endpoint' });

  if (error) {
      console.error("Save sub error:", error);
      return { success: false, error: error.message };
  }
  return { success: true };
}

export async function sendNotificationToUser(userId: string, title: string, body: string, url: string = "/dashboard") {
    const supabase = createAdminClient();
    
    const { data: subscriptions } = await supabase
        .from("push_subscriptions")
        .select("*")
        .eq("user_id", userId);

    if (!subscriptions || subscriptions.length === 0) return;

    const payload = JSON.stringify({ title, body, url });

    const promises = subscriptions.map(async (sub) => {
        try {
            await webPush.sendNotification({
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth
                }
            }, payload);
        } catch (error: unknown) {
            if (isWebPushError(error)) {
                console.error("WebPush Error Code:", error.statusCode);

                if (error.statusCode === 410 || error.statusCode === 404) {
                    await supabase.from("push_subscriptions").delete().eq("id", sub.id);
                }
            } else {

                console.error("Unknown error sending push:", error);
            }
        }
    });

    await Promise.all(promises);
}

function isWebPushError(error: unknown): error is WebPushError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'statusCode' in error &&
        'headers' in error
    );
}