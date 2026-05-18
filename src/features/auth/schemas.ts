import { z } from "zod";

export const EmailSignInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
