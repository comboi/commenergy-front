# Frontend API client and env strategy

Related issue: #1

## Goal

Use one canonical API client and one canonical environment variable strategy for all frontend-to-backend communication.

## Canonical choice

### API client

The canonical frontend API client is:

- `lib/api-client.ts`

This client owns shared request behavior such as:

- base URL configuration
- JSON defaults
- auth token header injection
- 401 handling for authenticated requests

### Environment variable

The canonical public env var is:

- `NEXT_PUBLIC_API_BASE_URL`

## Legacy compatibility

There was historical ambiguity between:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_API_URL`

To avoid breaking existing local setups during migration, the client currently resolves base URL with this order:

1. `NEXT_PUBLIC_API_BASE_URL`
2. `NEXT_PUBLIC_API_URL` (legacy fallback)

New setup and future docs should use only `NEXT_PUBLIC_API_BASE_URL`.

## Current source of truth files

- `lib/api-client.ts`
- `lib/api-config.ts`

## What should no longer be used

- multiple axios instances for the same backend
- duplicated env naming for the same backend target
- feature-level ad-hoc base URL configuration

## First migrated slice

This cleanup removes the unused alternate client entry point and keeps the app on one shared client foundation.

Representative existing consumers already using the canonical client include:

- auth context and password-reset flows
- contracts service hooks
- communities service hooks
- shared providers hooks
- users service hooks

## Follow-up rule

When adding a new data hook or mutation:

1. import the shared client from `@/lib/api-client`
2. do not create a second axios client unless it targets a genuinely different backend
3. use `NEXT_PUBLIC_API_BASE_URL` for new environment configuration
