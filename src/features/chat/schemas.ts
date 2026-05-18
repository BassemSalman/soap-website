import { z } from "zod";

export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

export const SendMessageSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1),
  sessionId: z.string().cuid().optional(),
});
