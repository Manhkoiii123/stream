import z from "zod";

export const changeNotificationSettingSchema = z.object({
  siteNotifications: z.boolean(),
  telegramNotifications: z.boolean(),
});

export type TypeChangeNotificationSettingSchema = z.infer<
  typeof changeNotificationSettingSchema
>;
