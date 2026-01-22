'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

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

  await supabase.from("events").insert({
    title,
    location,
    start_time: startIso,
    end_time: endIso,
    couple_id: coupleId,
    created_by: user.id,
    type: type || 'other',
  });

  revalidatePath("/dashboard");
}

export async function deleteEvent(eventId: string) {
  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", eventId);
  revalidatePath("/dashboard");
}
