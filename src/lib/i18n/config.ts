export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function t<T extends Record<string, unknown>>(
  record: T,
  key: string,
  locale: Locale
): string {
  const localeKey = `${key}_${locale}` as keyof T;
  const fallbackKey = `${key}_en` as keyof T;
  return (record[localeKey] ?? record[fallbackKey] ?? "") as string;
}
