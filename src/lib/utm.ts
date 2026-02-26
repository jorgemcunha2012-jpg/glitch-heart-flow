const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "ttclid",
  "fbclid",
  "gclid",
] as const;

const STORAGE_KEY = "tiktok_utms";

export function captureUtms(): void {
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utms[key] = value;
  }

  // Only overwrite if we have new UTMs (preserve existing on internal navigations)
  if (Object.keys(utms).length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(utms));
  }
}

export function getUtms(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}
