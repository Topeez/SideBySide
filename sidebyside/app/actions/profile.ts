"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type DashboardLayoutType = "default" | "focus" | "calendar";

// Definice schématu pro validaci (musí sedět s formulářem)
const ProfileSchema = z.object({
  full_name: z.string().min(2, "Jméno musí mít alespoň 2 znaky"),
  nickname: z.string().optional(),
  bio: z.string().optional(),
  clothing_size_top: z.string().optional(),
  clothing_size_bottom: z.string().optional(),
  shoe_size: z.string().optional(),
  ring_size: z.string().optional(),
  love_language: z.string().optional(),
  favorite_color: z.string().optional(),
  birth_date: z.date().optional(),
});

export async function updateProfile(prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { message: "Nejste přihlášen" };

  // Vytáhneme data z FormData
    const rawData = {
    full_name: formData.get("full_name"), 
    nickname: formData.get("nickname") || undefined,
    bio: formData.get("bio") || undefined,
    clothing_size_top: formData.get("clothing_size_top") || undefined,
    clothing_size_bottom: formData.get("clothing_size_bottom") || undefined,
    shoe_size: formData.get("shoe_size") || undefined,
    ring_size: formData.get("ring_size") || undefined,
    love_language: formData.get("love_language") || undefined,
    favorite_color: formData.get("favorite_color") || undefined,
    birth_date: formData.get("birth_date") ? new Date(formData.get("birth_date") as string) : undefined
  };

  // Validace
  const validatedFields = ProfileSchema.safeParse(rawData);

  if (!validatedFields.success) {
      // Pro jistotu si to vypiš do terminálu, kdyby tam bylo ještě něco
      console.log("Validation errors:", validatedFields.error.flatten().fieldErrors);
      
      return {
          success: false,
          message: "Chyba validace: Zkontrolujte zadané údaje.",
          errors: validatedFields.error.flatten().fieldErrors
      };
  }

  // Update v databázi
  const { error } = await supabase
    .from("profiles")
    .update(validatedFields.data)
    .eq("id", user.id);

  if (error) {
    return { message: "Chyba při ukládání: " + error.message };
  }

  // Překreslíme stránku profilu
  revalidatePath(`/profile/${user.id}`);
  
  return { message: "Uloženo úspěšně", success: true };
}

export async function updateTheme(theme: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Nejste přihlášen");
    }

    const { error } = await supabase
        .from("profiles")
        .update({ theme })
        .eq("id", user.id);

    if (error) {
        console.error("Error updating theme:", error);
        throw new Error("Chyba při ukládání vzhledu");
    }

    revalidatePath("/dashboard");
    return { success: true };
}


export async function updateLayout(layout: DashboardLayoutType){
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if(!user) {
    throw new Error("Nejste přihlášen");
  } 

  const { error } = await supabase
  .from("profiles")
  .update({ dashboard_layout: layout })
  .eq("id", user.id);

  if(error) throw new Error("Chyba při ukládání vzhledu");

  revalidatePath("/dashboard");
}

export async function isValidLayout(value: string | null | undefined): Promise<DashboardLayoutType | undefined> {
    if (value === null || value === undefined) {
    return undefined;
  }
  if (["default", "focus", "calendar"].includes(value)) {
    return value as DashboardLayoutType;
  }
  return undefined;
}
