import { createClient } from "@supabase/supabase-js";
import webPush from "web-push";

interface Subscription {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

webPush.setVapidDetails(
  Deno.env.get("VAPID_SUBJECT")!,
  Deno.env.get("NEXT_PUBLIC_VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!
);

Deno.serve(async (req: { json: () => PromiseLike<{ user_id: any; title: any; body: any; url: any; type: any; }> | { user_id: any; title: any; body: any; url: any; type: any; }; }) => {
  const { user_id, title, body, url, type } = await req.json();
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Preference check
  if (type) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("notification_preferences")
      .eq("id", user_id)
      .single();
    const prefs = profile?.notification_preferences ?? {};
    if (prefs[type] === false) return new Response("skipped");
  }

  // Fetch subscriptions + send (stejná logika jako tvůj původní kód)
  const { data: subs } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", user_id);

  await Promise.all((subs ?? []).map(async (sub: Subscription) => {
    try {
      await webPush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({ title, body, url })
      );
    } catch (e: any) {
      if (e.statusCode === 410 || e.statusCode === 404) {
        await supabase.from("push_subscriptions").delete().eq("id", sub.id);
      }
    }
  }));

  return new Response("ok");
});
