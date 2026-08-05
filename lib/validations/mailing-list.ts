import { z } from "zod";

export const MailingListSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email cannot exceed 255 characters" }),
});

export type MailingListInput = z.infer<typeof MailingListSchema>;
