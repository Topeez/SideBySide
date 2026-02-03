"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { sendNotificationToUser } from "./push";
import { v4 as uuidv4 } from "uuid";

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
  const title = formData.get("title") as string;
  const status = formData.get("status") as string;
  const coupleId = formData.get("coupleId") as string;

  if(!title || !coupleId) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

    const { error } = await supabase.from("bucket_list_items").insert({
        title,
        status: status || "planned",
        couple_id: coupleId
    });

    if (error) {
        console.error("Error creating bucket item:", error);
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
                    "Nový sen do Bucket Listu ✨",
                    `${fullName} přidal: ${title}`,
                    "/dashboard/couple"
                );
            }
        }
    } catch (e) { console.error("Push error:", e); }

    revalidatePath("/dashboard/couple");
}

export async function toggleBucketItemStatus(itemId: string, newStatus: string) {
    const supabase = await createClient();
    await supabase.from("bucket_list_items").update({ status: newStatus }).eq("id", itemId);
    revalidatePath("/dashboard/couple");
}