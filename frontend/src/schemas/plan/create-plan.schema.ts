import { z } from "zod";

export const createPlanSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0.01),
});

export type CreatePlanSchema = z.infer<typeof createPlanSchema>;
