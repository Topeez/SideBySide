'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { sendNotificationToUser } from "@/app/actions/push";

export async function createTodo(formData: FormData) {
  const title = formData.get("title") as string;
  const coupleId = formData.get("coupleId") as string;

  if (!title || !coupleId) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase.from("todos").insert({
    title,
    couple_id: coupleId,
    created_by: user.id
  });

  if (error) return;

  const { data: couple } = await supabase.from("couples").select("user1_id, user2_id").eq("id", coupleId).single();
  
  if (couple) {
      const partnerId = couple.user1_id === user.id ? couple.user2_id : couple.user1_id;
      if (partnerId) {
          await sendNotificationToUser(
              partnerId,
              "Nový úkol ✅",
              `${user.user_metadata.full_name || 'Partner'} přidal: ${title}`,
              "/dashboard"
          );
      }
  }


  revalidatePath("/dashboard");
}
