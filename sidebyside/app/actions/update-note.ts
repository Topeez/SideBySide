'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateLoveNote(formData: FormData) {
  const note = formData.get("note") as string;
  const coupleId = formData.get("coupleId") as string;

  if (!coupleId || !note) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  // Update v DB
  await supabase
    .from('couples')
    .update({ 
        love_note: note,
        love_note_author_id: user.id 
    })
    .eq('id', coupleId);

  revalidatePath('/dashboard');
}
