'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { sendNotificationToUser } from "@/app/actions/push";

export async function createEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const coupleId = formData.get("coupleId") as string;
  const type = formData.get("type") as string; 
  const dateBase = formData.get("dateBase") as string;
  const startTimeStr = formData.get("startTime") as string;
  const endTimeStr = formData.get("endTime") as string;

  if (!title || !dateBase || !startTimeStr) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const startIso = new Date(`${dateBase}T${startTimeStr}`).toISOString();
  
  let endIso = null;
  if (endTimeStr) {
      endIso = new Date(`${dateBase}T${endTimeStr}`).toISOString();
  }

  const { error } = await supabase.from("events").insert({
    title,
    location,
    start_time: startIso,
    end_time: endIso,
    couple_id: coupleId,
    created_by: user.id,
    type: type || 'other',
  });

  if (error) {
    console.error("Chyba při insertu events:", error);
    return;
  }

  try {
      // 1. Zjistíme partnera
      const { data: couple } = await supabase
          .from("couples")
          .select("user1_id, user2_id")
          .eq("id", coupleId)
          .single();

      if (couple) {
          // Kdo je ten druhý?
          const partnerId = couple.user1_id === user.id ? couple.user2_id : couple.user1_id;

          if (partnerId) {
              const fullName = user.user_metadata.full_name || "Partner";
              const message = `Kdy: ${dateBase} v ${startTimeStr}`;

              // 2. Pošleme notifikaci
              await sendNotificationToUser(
                  partnerId, 
                  `Nová akce: ${title} 📅`, 
                  `${fullName} přidal(a) novou událost. ${message}`,
                  "/dashboard"
              );
          }
      }
  } catch (pushError) {
      // Push notifikace nesmí shodit celou akci, takže jen logujeme
      console.error("Failed to send push notification:", pushError);
  }

  revalidatePath("/dashboard");
}

export async function deleteEvent(eventId: string) {
  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", eventId);
  revalidatePath("/dashboard");
}
