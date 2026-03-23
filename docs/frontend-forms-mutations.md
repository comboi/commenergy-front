# Frontend forms, mutations and feedback patterns

## Goal

Standardize create/update/delete flows so forms, cache invalidation and user feedback behave consistently across features.

## Rules

### 1. Keep side effects inside mutation callbacks

Use React Query mutation lifecycle callbacks instead of `useEffect` watchers on `isSuccess` / `isError`.

Prefer:

- `onSuccess` → invalidate queries, show success toast, close modal, navigate if needed
- `onError` → log technical error and show user-facing toast

Avoid:

- `useEffect(() => { if (isSuccess) ... })`

### 2. Query invalidation should be feature-key based

Each domain should expose reusable query keys.

Example:

- `communityQueryKeys.all`
- `contractQueryKeys.all`

Mutations invalidate those keys instead of hard-coded ad hoc strings.

### 3. Forms own local input state; mutations own server side effects

Components should:

- collect values
- run synchronous validation
- call one mutation

Mutations should:

- talk to the backend
- trigger cache invalidation
- emit toasts
- invoke optional success callbacks

### 4. Delete flows should wait for mutation success before closing

Do not close confirmation modals optimistically unless the UX explicitly wants it. Default to closing after mutation success.

## Representative migration applied

The `communities` CRUD mutations now:

- use `onSuccess` / `onError` instead of `useEffect`
- invalidate `communityQueryKeys`
- produce consistent success/error toasts

The delete-community modal now waits for mutation success and shows pending state.

## Migration checklist

- remove `useEffect`-driven mutation side effects from remaining domains
- centralize per-feature query keys
- add pending UI states to submit/delete buttons
- standardize server error mapping where backend payloads become richer
