'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { sendNotificationToUser } from "@/app/actions/push";

export async function updateLoveNote(formData: FormData) {
  const note = formData.get("note") as string || "";
  const coupleId = formData.get("coupleId") as string;

  if (!coupleId) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from('couples')
    .update({
        love_note: note,
        love_note_author_id: user.id,
        love_note_updated_at: new Date().toISOString(),
    })
    .eq('id', coupleId);

  if (error) {
      console.error("Error updating love note:", error);
      return;
  }

  if(note.trim().length > 0 || note.trim().length > 1) {
      try {

      const { data: couple } = await supabase
          .from("couples")
          .select("user1_id, user2_id")
          .eq("id", coupleId)
          .single();

      if (couple) {
          const partnerId = couple.user1_id === user.id ? couple.user2_id : couple.user1_id;

          if (partnerId) {
              const fullName = user.user_metadata.full_name || "Partner";
              
              const preview = note.length > 50 ? note.substring(0, 50) + "..." : note;

              await sendNotificationToUser(
                  partnerId, 
                  "Nový vzkaz ❤️", 
                  `${fullName} ti nechal(a) vzkaz: "${preview}"`,
                  "/dashboard"
              );
          }
      }
    } catch (pushError) {
        console.error("Push notification error:", pushError);
    }
  }

  revalidatePath('/dashboard');
}
