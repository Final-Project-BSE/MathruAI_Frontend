import type { LanguageCode } from "@/components/common/useLanguage";

const GOOGLE_TRANSLATE_URL =
  "https://translate.googleapis.com/translate_a/single";

const CACHE_PREFIX = "translation-cache:";

function getCacheKey(text: string, targetLanguage: LanguageCode) {
  return `${CACHE_PREFIX}${targetLanguage}:${text}`;
}

export async function translateText(
  text: string,
  targetLanguage: LanguageCode
): Promise<string> {
  if (!text || targetLanguage === "en") {
    return text;
  }

  const normalizedText = text.trim();

  if (!normalizedText) {
    return text;
  }

  const cacheKey = getCacheKey(normalizedText, targetLanguage);

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
  } catch {
    // Ignore localStorage errors.
  }

  try {
    const params = new URLSearchParams({
      client: "gtx",
      sl: "auto",
      tl: targetLanguage,
      dt: "t",
      q: normalizedText,
    });

    const response = await fetch(`${GOOGLE_TRANSLATE_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Translation request failed");
    }

    const data = await response.json();

    const translated = data?.[0]
      ?.map((item: unknown[]) => item?.[0])
      .join("");

    if (!translated) {
      return text;
    }

    try {
      localStorage.setItem(cacheKey, translated);
    } catch {
      // Ignore localStorage quota errors.
    }

    return translated;
  } catch (error) {
    console.error("Translation failed:", error);
    return text;
  }
}

export async function translateMany(
  values: string[],
  targetLanguage: LanguageCode
): Promise<string[]> {
  if (targetLanguage === "en") {
    return values;
  }

  return Promise.all(values.map((value) => translateText(value, targetLanguage)));
}