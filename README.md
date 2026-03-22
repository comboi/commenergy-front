# Commenergy Frontend

Next.js frontend for the Commenergy platform. This repository contains the back-office UI used to manage energy communities, contracts, users, documentation flows, and authentication-related screens.

## What this app does

Commenergy helps internal teams operate energy communities from a single web interface. The current frontend includes:

- a public landing page at `/`
- an authenticated platform area under `/platform`
- community management flows
- contract management flows
- user registration and auth recovery screens
- documentation pages such as the CSV import guide

## Stack

- Next.js 14 App Router
- TypeScript
- React Query for server state
- Axios for API access
- Tailwind CSS + shadcn/ui-style components

## Project structure

```text
app/
  page.tsx                       Public landing page
  docs/                          In-app documentation pages
  platform/                      Authenticated platform area
    auth/                        Login, register, forgot/reset password
    communities/                 Community management screens and services
    contracts/                   Contract and data-source management
    users/                       User-related flows
components/                      Shared UI and domain components
hooks/                           Reusable UI hooks
lib/                             API clients and generated schema types
providers/                       App-wide providers (React Query)
styles/                          Global styling entrypoints
utils/                           Formatting and browser utility helpers
```

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a local `.env.local` file:

```bash
cp .env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_API_BASE_URL`: base URL used by the authenticated API client in `lib/api-client.ts`
- `NEXT_PUBLIC_API_URL`: base URL used by the secondary Axios instance in `lib/api.ts`

In most environments both values should point to the same backend origin unless there is a deliberate reason to split them.

### 3. Start the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Available scripts

- `npm run dev` — start the Next.js dev server
- `npm run build` — create a production build
- `npm run start` — serve the production build
- `npm run lint` — run Next.js linting
- `npm run generate-api-schema` — regenerate `lib/api-schema.d.ts` from the backend OpenAPI document

## API schema workflow

The frontend relies on generated TypeScript types in `lib/api-schema.d.ts`.

To refresh them:

```bash
npm run generate-api-schema
```

By default the script reads the schema from:

- `http://localhost:5500/api/open-api.yaml`

Before regenerating types, make sure the backend is running and exposing that document. Review the resulting diff carefully before committing because many domain models import types from this generated file.

## Authentication and session model

- login is handled against `POST /auth/login`
- the returned JWT is stored in the `auth-token` browser cookie
- authenticated requests attach `Authorization: Bearer <token>` via `lib/api-client.ts`
- `AuthProvider` fetches the current user from `/users/me`
- unauthorized API responses clear the cookie and redirect back to `/platform/auth/login`

This means frontend auth state is cookie-backed on the client side, with React Query used to cache the current user.

## Developer notes

See [`docs/development.md`](docs/development.md) for setup expectations, app conventions, auth/session notes, and schema generation guidance.
