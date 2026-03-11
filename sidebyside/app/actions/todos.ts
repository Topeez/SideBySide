'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTodo(formData: FormData) {
  const title = formData.get("title") as string;
  const coupleId = formData.get("coupleId") as string;

  if (!title || !coupleId){
    console.error("Chybí title nebo coupleId");
    return;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user){
    console.error("Uživatel není přihlášen");
    return;
  };

  const { error } = await supabase.from("todos").insert({
    title,
    couple_id: coupleId,
    created_by: user.id
  }).select();

  if (error) {
    console.error("Chyba při insertu todos:", error);
    return;
  }

  try {
      const { data: couple } = await supabase.from("couples").select("user1_id, user2_id").eq("id", coupleId).single();
      
      if (couple) {
          const partnerId = couple.user1_id === user.id ? couple.user2_id : couple.user1_id;
          if (partnerId) {
              const fullName = user.user_metadata.full_name || "Partner";
              await supabase.from("notifications").insert({
                  user_id: partnerId,
                  title: "Nový úkol 📝",
                  message: `${fullName} přidal(a): ${title}`,
                  link: "/dashboard",
                  type: "todos"
              });
          }
      }
  } catch (e) {
      console.error("Notification error:", e);
  }

  revalidatePath("/dashboard");
}

export async function toggleTodo(todoId: string, isCompleted: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: todo, error } = await supabase
    .from("todos")
    .update({ is_completed: isCompleted })
    .eq("id", todoId)
    .select("title, couple_id")
    .single();

  if (error) {
      console.error("Error toggling todo:", error);
      return;
  }

  revalidatePath("/dashboard");

  if (user && isCompleted && todo) {
      try {
          const { data: couple } = await supabase
            .from("couples")
            .select("user1_id, user2_id")
            .eq("id", todo.couple_id)
            .single();

          if (couple) {
              const partnerId = couple.user1_id === user.id ? couple.user2_id : couple.user1_id;
              
              if (partnerId) {
                  const fullName = user.user_metadata.full_name || "Partner";
                  await supabase.from("notifications").insert({
                      user_id: partnerId,
                      title: "Úkol splněn! ✅",
                      message: `${fullName} splnil(a): ${todo.title}`,
                      link: "/dashboard",
                      type: "todos"
                  });
              }
          }
      } catch (e) {
          console.error("Notification error (toggle):", e);
      }
  }
}

export async function deleteTodo(todoId: string) {
    const supabase = await createClient();
    await supabase.from("todos").delete().eq("id", todoId);
    revalidatePath("/dashboard");
}
