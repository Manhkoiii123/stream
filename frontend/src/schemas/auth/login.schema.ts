import { z } from "zod";

export const loginSchema = z.object({
  login: z.string().min(1),
  password: z.string().min(8),
  pin: z.string().min(6).max(6).optional(),
});

export type TypeLoginSchema = z.infer<typeof loginSchema>;
