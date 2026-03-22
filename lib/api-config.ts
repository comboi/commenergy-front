const canonicalApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

export const API_ENV_KEYS = {
  canonical: 'NEXT_PUBLIC_API_BASE_URL',
  legacyFallback: 'NEXT_PUBLIC_API_URL',
} as const;

export function getApiBaseUrl(): string | undefined {
  return canonicalApiBaseUrl;
}

export function getApiEnvStrategy() {
  return {
    canonical: API_ENV_KEYS.canonical,
    legacyFallback: API_ENV_KEYS.legacyFallback,
    baseUrl: canonicalApiBaseUrl,
  };
}
