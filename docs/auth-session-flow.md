# Auth/session flow

## Problem being addressed

The previous auth flow split decisions across three places with overlapping responsibilities:

- `middleware.ts` checked only for cookie presence
- `AuthProvider` fetched `/users/me` and also handled login/logout
- `lib/api-client.ts` forcibly redirected on any non-login `401`

That made expired-session behavior harder to reason about and mixed transport concerns with navigation.

## Current policy

### 1. Cookie presence gates route access

`middleware.ts` remains the first guard for direct requests and refreshes.

- If there is no `auth-token` cookie and the route is private, redirect to login.
- If there is an auth cookie and the route is public, redirect to `/platform`.

This keeps server-side route protection simple and predictable.

### 2. `AuthProvider` is the client-side source of truth for session state

The provider owns:

- bootstrapping the current user via `/users/me`
- login
- logout
- client-side redirects after login, logout, or expiry
- cross-tab session synchronization

The provider query key `['auth', 'session']` is the canonical in-app session cache.

### 3. The API client only handles HTTP concerns

`lib/api-client.ts` now:

- injects the bearer token from the shared session helper
- emits a session-expired event on `401`
- does **not** perform navigation directly

This keeps redirect decisions out of the axios layer.

## Event model

`lib/session.ts` centralizes:

- cookie name and key routes
- public-route matching
- token read/write/clear helpers
- session events broadcast through:
  - `window` custom events for same-tab updates
  - `localStorage` for cross-tab synchronization

Events used:

- `auth:logged-in`
- `auth:logged-out`
- `auth:expired`

## Login flow

1. submit credentials to `/auth/login`
2. persist token via shared session helper
3. fetch `/users/me`
4. store the user in the auth query cache
5. redirect to `/platform`

If `/users/me` fails after login, the token is cleared and the login attempt is treated as failed.

## Expired session flow

1. any authenticated request returns `401`
2. api client clears token and broadcasts `auth:expired`
3. auth provider clears cached session state
4. user is redirected to login

## Scope of this refactor

This slice intentionally focuses on:

- login
- protected-route behavior
- logout/expiry consistency

It does **not** yet redesign registration, password reset, or a future server-hardened cookie/session model.

## Follow-up work

- decide whether the auth token should remain client-readable or move to a more hardened backend-managed session strategy
- standardize UX messaging for expired sessions versus invalid credentials
- migrate auth-related types and service calls into the domain structure planned in issues #3 and #6
