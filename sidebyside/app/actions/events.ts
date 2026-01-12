'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const coupleId = formData.get("coupleId") as string;
  
  // Data z formuláře
  const dateBase = formData.get("dateBase") as string; // "2026-01-12"
  const startTimeStr = formData.get("startTime") as string; // "14:00"
  const endTimeStr = formData.get("endTime") as string; // "16:00" nebo ""

  if (!title || !dateBase || !startTimeStr) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Slepíme Datum a Čas do ISO stringu (např. "2026-01-12T14:00:00.000Z")
  // Pozor: new Date("2026-01-12T14:00") vytvoří lokální čas
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
    created_by: user.id
  });

  revalidatePath("/dashboard");
}
