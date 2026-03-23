# Frontend typing strategy

## Goal

Make type ownership explicit so generated OpenAPI types, feature aliases and UI editing models do not compete with each other.

## Canonical rule

### 1. Generated OpenAPI types are the source of truth for transport contracts

Use `lib/api-schema.d.ts` for:

- request DTOs sent to the backend
- response payloads returned by the backend
- enum/string-literal values owned by the API

Do not import `lib/api-schema` directly all over the app. Wrap it in feature-local aliases first.

### 2. Feature-local aliases are the source of truth for domain usage inside the app

Example:

- `contracts/types/contract.ts`

This gives the feature one stable import surface even if the generated schema changes location or naming later.

### 3. UI/view/form types are separate when the screen shape differs from the API

Use feature-local UI types when the interface needs:

- editable string values
- partial steps
- derived labels
- grouped fields
- defaults not present in the API

Example applied:

- `contracts/types/contract-form.ts`

The contract form no longer edits `ContractDto` directly. It edits `ContractFormValues`, then maps to API DTOs through a mapper.

## Mapping policy

When API shape and UI shape differ, add explicit mappers under `mappers/`.

Example applied:

- `contracts/mappers/contract-form.ts`
  - `mapContractToFormValues`
  - `mapContractFormToCreateDto`
  - `createEmptyContractForm`

## Practical rules

- API call files return feature transport/domain aliases
- components should avoid importing generated schema types directly
- forms should prefer dedicated form/view models
- route files should consume feature hooks and mapped types, not raw schema details

## Representative migration

`contracts` now demonstrates:

- API contract aliases in `types/contract.ts`
- dedicated UI form model in `types/contract-form.ts`
- explicit API/UI conversion in `mappers/contract-form.ts`

## Cleanup plan

Apply the same policy next to:

- communities create/edit flows
- auth forms and user bootstrap payloads
- any screens currently storing OpenAPI DTOs directly in local React state
