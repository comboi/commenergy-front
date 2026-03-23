# Frontend testing strategy

## Goal

Introduce a small but repeatable test baseline that protects critical refactor-prone logic without forcing a heavy end-to-end setup immediately.

## Stack

- **Vitest** for fast unit/integration tests
- **jsdom** as browser-like environment
- **Testing Library** available for future component tests

## Test placement

- `tests/lib/*` for cross-cutting helpers and shared platform logic
- `tests/contracts/*` for contracts-domain tests
- future domains should follow the same `tests/<feature>/` structure

## First baseline included

### Session / protected-route logic
- `tests/lib/session.test.ts`
- validates public vs private route detection used by auth/middleware flow

### Contract form mapping logic
- `tests/contracts/contract-form.test.ts`
- validates UI form defaults
- validates `ContractEnriched` → form mapping
- validates form → API DTO mapping

## Why this baseline matters

These tests protect logic touched by the current refactor stack:

- auth/protected-route behavior (#2)
- typing/mapping policy (#6)
- contracts form evolution (#5/#6)

## Commands

- `npm run test`
- `npm run test:watch`

## Next recommended additions

1. auth login screen error/success rendering
2. protected route redirect behavior around `AuthProvider`
3. community CRUD modal flows
4. contracts table toolbar/filter interactions
