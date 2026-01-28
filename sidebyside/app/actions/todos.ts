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

  const { error, data } = await supabase.from("todos").insert({
    title,
    couple_id: coupleId,
    created_by: user.id
  }).select();

  if (error) {
    console.error("Chyba při insertu todos:", error);
    return;
  }

  if (!data || data.length === 0) {
      console.error("RLS Error: Insert proběhl, ale vrátil 0 řádků. Zkontroluj Policies.");
      return;
  }

  revalidatePath("/dashboard");
}

export async function toggleTodo(todoId: string, isCompleted: boolean) {
  const supabase = await createClient();
  await supabase.from("todos").update({ is_completed: isCompleted }).eq("id", todoId);
  revalidatePath("/dashboard");
}

export async function deleteTodo(todoId: string) {
    const supabase = await createClient();
    await supabase.from("todos").delete().eq("id", todoId);
    revalidatePath("/dashboard");
}
