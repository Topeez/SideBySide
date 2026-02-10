import { z } from "zod";

export const ProfileSchema = z.object({
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