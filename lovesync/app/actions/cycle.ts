"use server"

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/actions";

export async function updateCycleSettings(
  prevState: unknown,
  formData: FormData,
): Promise <ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if(!user) return { success: false, error: "Nejste přihlášen." }

  const lastPeriod = formData.get("last_period_start") as string | null;
  const cycleLength = formData.get("cycle_length_days") as string | null;
  const periodLength = formData.get("period_length_days") as string | null;
  const sharingMode = formData.get("sharing_mode") as string | null;

  if(!lastPeriod) return { success: false, error: "Vyplňte prosím datum poslední menstruace." }

  const cycleDays = cycleLength ? parseInt(cycleLength, 10): 28;
  const periodDays = periodLength ? parseInt(periodLength, 10): 5;

  const { data: couple } = await supabase
      .from("couples")
      .select("id, user1_id, user2_id")
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .maybeSingle()

  const coupleId = couple?.id ?? null;

  const { error } = await supabase
      .from("cycle_tracking")
      .upsert({
        user_id: user.id,
        couple_id: coupleId,
        last_period_start: lastPeriod,
        cycle_length_days: cycleDays,
        period_length_days: periodDays,
        sharing_mode: sharingMode ?? "private",
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" })

  if(error) {
    console.error("updateCycleSettings error: ", error);
    return { success: false, error: "Nepodařilo se uložit nastavení cyklu." }
  }

  revalidatePath("/dashboard");
  revalidatePath(`/profile/${user.id}`);
  return { success: true }
}