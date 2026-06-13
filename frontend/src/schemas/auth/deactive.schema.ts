import z from "zod";

export const DeactiveSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  pin: z.string().min(6).max(6).optional(),
});

export type DeactiveSchemaType = z.infer<typeof DeactiveSchema>;
