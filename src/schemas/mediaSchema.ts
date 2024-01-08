import { z } from "zod";

export const sendEmailContactSchema = z.object({
  name: z
    .string()
    .min(3, { message: "name cannot be less than 3" })
    .max(255, "name cannot be more than 255"),
  email: z
    .string()
    .email()
    .min(3, { message: "email cannot be less than 3" })
    .max(255, "email cannot be more than 255"),
  comment: z
    .string()
    .min(3, { message: "comment cannot be less than 3" })
    .max(2040, "comment cannot be more than 255"),
  subject: z
    .string()
    .min(3, { message: "subject cannot be less then 3" })
    .max(255, { message: "subject cannot be more than 255" }),
});

export type SendEmailContactSchema = z.infer<typeof sendEmailContactSchema>;
