# Frontend domain architecture

## Goal

Give each feature/domain one predictable internal shape so new code does not mix API calls, React Query hooks, view logic and shared types in arbitrary places.

## Canonical feature structure

For feature modules such as `contracts`, `communities` or `auth`, prefer:

- `api/` → raw backend calls and query-key definitions
- `queries/` → read-oriented React Query hooks
- `mutations/` → write-oriented React Query hooks and cache invalidation
- `types/` → feature-owned types and aliases
- `components/` → UI pieces
- `page.tsx` / route files → composition only

Optional when needed:

- `mappers/` → API → UI/view model transforms
- `schemas/` → form validation schemas
- `constants/` → feature-specific constants
- `utils/` → pure helpers local to the feature

## Ownership rules

### `api/`
- no JSX
- no local component state
- no navigation side effects
- keep request shape and query keys together

### `queries/`
- compose `api/` functions into stable read hooks
- expose safe defaults (`data ?? []`) when appropriate
- keep query keys feature-local and reusable

### `mutations/`
- centralize mutation side effects
- own cache invalidation rules
- own toast/success-error feedback when shared by all consumers

### `types/`
- define canonical feature types
- generated OpenAPI types are valid inputs here, but feature imports should prefer feature-local aliases over importing `lib/api-schema` everywhere

### route files / screen containers
- compose hooks and components
- avoid embedding raw API calls or contract shaping logic directly in pages

## Reference migration applied

`contracts` is now the reference domain for:

- `api/contracts.ts`
- `queries/useContractsQuery.ts`
- `queries/useContractQuery.ts`
- `mutations/useCreateContractMutation.ts`
- `mutations/useUpdateContractMutation.ts`
- `mutations/useDeleteContractMutation.ts`
- `types/contract.ts`

Backward-compatible wrappers remain temporarily in `services/` and `model/` so the migration can happen incrementally.

## Follow-up checklist

- migrate `communities` reads/writes to the same shape
- move domain-specific form schemas into feature folders
- add mappers where API payloads diverge from UI/editing needs
- reduce route-level client logic in large screens by extracting screen composition helpers
