"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const PasswordSchema = z.object({
  password: z.string().min(6, "Heslo musí mít alespoň 6 znaků"),
  confirmPassword: z.string().min(6, "Heslo musí mít alespoň 6 znaků"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Hesla se neshodují",
  path: ["confirmPassword"],
});

export async function updatePassword(prevState: unknown, formData: FormData) {
  const supabase = await createClient();

  // 1. Validace inputů
  const rawData = {
    password: formData.get("password")?.toString(),
    confirmPassword: formData.get("confirmPassword")?.toString(),
  };

  const validatedFields = PasswordSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Chyba validace",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Update hesla v Supabase
  const { error } = await supabase.auth.updateUser({
    password: validatedFields.data.password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Heslo bylo úspěšně změněno.",
  };
}
