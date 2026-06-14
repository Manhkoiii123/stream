import { z } from "zod";

export const changeThemeSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
});

export type TypeChangeThemeSchema = z.infer<typeof changeThemeSchema>;
