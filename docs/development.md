# Development Notes

This document is the quick orientation guide for contributors working on the Commenergy frontend.

## Local setup checklist

1. Use Node.js 20+.
2. Install dependencies with `npm install`.
3. Create `.env.local` from `.env.example`.
4. Ensure the Commenergy backend is reachable.
5. Run `npm run dev`.

## Environment variables

| Variable | Used in | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | `lib/api-client.ts` | Main authenticated API client. Attaches bearer token automatically. |
| `NEXT_PUBLIC_API_URL` | `lib/api.ts` | Secondary plain Axios client used by some feature code. |

If the frontend talks to a single backend deployment, keep both URLs aligned.

## Routing conventions

- `/` is the public marketing/landing surface.
- `/platform/*` is the application area.
- `/platform/auth/*` contains authentication and password recovery flows.
- `/docs/*` is reserved for in-app product documentation.

## State and data fetching

- React Query is provided globally through `providers/query-provider.tsx`.
- Feature-level mutations and queries typically live close to each domain under `app/platform/**/services`.
- Shared type definitions are imported from `lib/api-schema.d.ts`.

## API schema generation

The repository tracks generated API types instead of generating them at runtime.

### Command

```bash
npm run generate-api-schema
```

### Expected backend endpoint

```text
http://localhost:5500/api/open-api.yaml
```

### When to run it

Run schema generation when backend contract changes affect frontend types or when onboarding against a fresh backend snapshot.

### Review checklist

- confirm the backend schema endpoint is current
- inspect `lib/api-schema.d.ts` diff for unexpected contract churn
- verify downstream imports still resolve cleanly

## Authentication and session behavior

Auth is implemented client-side in `app/platform/auth/contexts/auth-context.tsx`.

### Current flow

1. The login form posts credentials to `/auth/login`.
2. The backend returns a token.
3. The frontend stores that token in the `auth-token` cookie.
4. `AuthProvider` loads the current user from `/users/me`.
5. Future API requests include `Authorization: Bearer <token>`.
6. A `401 Unauthorized` response clears the cookie and redirects to `/platform/auth/login`.

### Notes for contributors

- the token is currently managed in a browser cookie via `js-cookie`
- auth state is derived from the user query, not just cookie presence
- logout also clears React Query caches before redirecting
- cross-tab logout is handled with the `storage` event listener in `AuthProvider`

## Documentation in this repo

- `README.md` = external/project-level onboarding
- `docs/development.md` = contributor setup and conventions
- `app/platform/auth/README.md` = feature-specific notes for password reset flow
