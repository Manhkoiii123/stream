import z from "zod";

export const enableTotpSchema = z.object({
  pin: z.string().min(6).max(6),
});

export type TypeEnableTotpSchema = z.infer<typeof enableTotpSchema>;
