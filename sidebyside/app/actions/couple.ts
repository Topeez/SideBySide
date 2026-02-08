"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { sendNotificationToUser } from "./push";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const BucketItemSchema = z.object({
  title: z.string().min(1, "Název je povinný"),
    image_url: z.string().url("Neplatný formát URL").optional().or(z.literal("")), 
    status: z.enum(["planned", "in_progress", "completed"]),
    coupleId: z.string().uuid(),
})

export async function updateCoverPhoto(coupleId: string, formData: FormData) {
    const imageFile = formData.get("cover") as File;

    if (!coupleId || !imageFile) return;

    const supabase = await createClient();

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `covers/${coupleId}/${uuidv4()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('couple-photos')
        .upload(fileName, imageFile);

    if (uploadError) {
        console.error("Cover upload error:", uploadError);
        return;
    }

    const { data: { publicUrl } } = supabase.storage
        .from('couple-photos')
        .getPublicUrl(fileName);

    await supabase
        .from("couples")
        .update({ cover_url: publicUrl })
        .eq("id", coupleId);

    revalidatePath("/dashboard/couple");
    revalidatePath("/couple");

}

export async function createMilestone(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const icon = formData.get("icon") as string;
  const coupleId = formData.get("coupleId") as string;

  if(!title || !date || !icon || !coupleId) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
  
    const { error } = await supabase.from("milestones").insert({
        title,
        description,
        date,
        icon: icon || "star",
        couple_id: coupleId
    });

    if (error) {
        console.error("Error creating milestone:", error);
        return;
    }

        try {
        const { data: couple } = await supabase.from("couples").select("user1_id, user2_id").eq("id", coupleId).single();
        if (couple) {
            const partnerId = couple.user1_id === user.id ? couple.user2_id : couple.user1_id;
            if (partnerId) {
                const fullName = user.user_metadata.full_name || "Partner";
                await sendNotificationToUser(
                    partnerId,
                    "Nový milník! 🏆",
                    `${fullName} přidal vzpomínku: ${title}`,
                    "/dashboard/couple"
                );
            }
        }
    } catch (e) { console.error("Push error:", e); }

    revalidatePath("/dashboard/couple");
}

export async function createBucketItem(formData: FormData) {
    const rawData = {
        title: formData.get("title"),
        image_url: formData.get("image_url"),
        status: formData.get("status"),
        coupleId: formData.get("coupleId"),
    };

    // 1. Validace pomocí Zod
    const validatedFields = BucketItemSchema.safeParse(rawData);

    if (!validatedFields.success) {
      // Vracíme první chybu
      return { success: false, message: validatedFields.error.message };
    }
    
    const { title, image_url, status, coupleId } = validatedFields.data;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "Nejste přihlášen" };

    // 2. Uložení do DB
    const { error } = await supabase.from("bucket_list_items").insert({
        title,
        status,
        // Pokud je string prázdný, uložíme NULL, jinak URL
        image_url: image_url || null, 
        couple_id: coupleId
    });

    if (error) {
        console.error("Error creating bucket item:", error);
        return { success: false, message: "Chyba při ukládání do databáze" };
    }


    try {
        const { data: couple } = await supabase.from("couples").select("user1_id, user2_id").eq("id", coupleId).single();
        if (couple) {
            const partnerId = couple.user1_id === user.id ? couple.user2_id : couple.user1_id;
            if (partnerId) {
                const fullName = user.user_metadata.full_name || "Partner";
                await sendNotificationToUser(
                    partnerId,
                    "Nový sen do Bucket Listu ✨",
                    `${fullName} přidal: ${title}`,
                    "/dashboard/couple"
                );
            }
        }
    } catch (e) { console.error("Push error:", e); }

    revalidatePath("/dashboard/couple");
}

export async function deleteBucketItem(itemId: string) {
    const supabase = await createClient();
    
    const { error } = await supabase
        .from("bucket_list_items")
        .delete()
        .eq("id", itemId);

    if (error) {
        console.error("Error deleting bucket item:", error);
        return;
    }

    revalidatePath("/dashboard/couple");
}


export async function toggleBucketItemStatus(itemId: string, newStatus: string) {
    const supabase = await createClient();
    await supabase.from("bucket_list_items").update({ status: newStatus }).eq("id", itemId);
    revalidatePath("/dashboard/couple");
}

export async function uncoupleUser(coupleId: string) {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Nejste přihlášen" };

    const { data: couple, error: fetchError } = await supabase
        .from("couples")
        .select("user1_id, user2_id")
        .eq("id", coupleId)
        .single();

    if (fetchError || !couple) {
        return { success: false, message: "Pár nenalezen." };
    }

    if (couple.user1_id !== user.id && couple.user2_id !== user.id) {
        return { success: false, message: "Nemáte oprávnění k této akci." };
    }

    const { error: deleteError } = await supabase
        .from("couples")
        .delete()
        .eq("id", coupleId);

    if (deleteError) {
        console.error("Uncouple error:", deleteError);
        return { success: false, message: "Nepodařilo se zrušit propojení." };
    }

    revalidatePath("/", "layout");
    return { success: true };
}