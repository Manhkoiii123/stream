import { z } from "zod";
export const socialLinkSchema = z.object({
    title: z.string(),
    url: z.string().url(),
}).strict()

export type TypeSocialLinkSchema = z.infer<typeof socialLinkSchema>

