// src/lib/t.ts
import ru from "@/i18n/ru.json";
import en from "@/i18n/en.json";

// Убедись, что в tsconfig.json есть:
// "compilerOptions": { "resolveJsonModule": true, "esModuleInterop": true }

type Lang = "ru" | "en";

// Приводим словари к простому словарю строк
const dict: Record<Lang, Record<string, string>> = {
  ru: ru as Record<string, string>,
  en: en as Record<string, string>,
};

/**
 * Простой переводчик с фолбэком:
 * 1) выбранный язык -> 2) en -> 3) ru -> 4) сам ключ
 */
export function t(key: string, lang: Lang = "en"): string {
  return (
    dict[lang]?.[key] ??
    dict.en?.[key] ??
    dict.ru?.[key] ??
    key
  );
}