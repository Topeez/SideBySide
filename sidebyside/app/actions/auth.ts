"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

export const PasswordSchema = z
  .object({
    password: z
      .string()
      .min(12, { message: "Heslo musí mít alespoň 12 znaků" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Potvrzení hesla je povinné" }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Hesla se neshodují",
        path: ["confirmPassword"],
      });
    }
  });
export async function updatePassword(prevState: null, formData: FormData) {
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
