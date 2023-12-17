
export const Languages = ['en', 'ru'] as const
export type TLanguage = (typeof Languages)[number]