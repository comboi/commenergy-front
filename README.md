# Commenergy SPA

This is the SPA of the project commenergy using Next.js + TypeScript.

## API environment variables

Frontend API access is centralized in `lib/api-client.ts`.

- Preferred env var: `NEXT_PUBLIC_API_URL`
- Backwards-compatible fallback: `NEXT_PUBLIC_API_BASE_URL`

### Recommended setup

1. Copy `.env.example` to `.env.local`
2. Set `NEXT_PUBLIC_API_URL` to the backend base URL

Example:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5500
```

`lib/api.ts` re-exports the same canonical client for compatibility, so new code should use the shared client instead of creating additional API instances.
