export const COOKIE_NAME = 'language'
export const languages = ['vi', 'en'] as const
export const defaultLanguage: Language = 'vi'
export type Language = (typeof languages)[number]
