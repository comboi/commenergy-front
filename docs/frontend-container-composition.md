# Frontend container composition patterns

## Goal

Reduce screen-level components that combine fetching, table config, filtering, navigation, modal orchestration and row actions in one file.

## Pattern

For container-heavy screens, prefer splitting into:

- **screen/container** → owns route-level orchestration and feature hooks
- **table columns hook/config** → owns table column definitions and row actions
- **toolbar** → owns filters and list-level actions
- **modals** → owns modal composition only

## Representative refactor

`contracts/components/contracts-table.tsx` was decomposed into:

- `contracts-table-columns.tsx`
- `contracts-table-toolbar.tsx`
- `contracts-table-modals.tsx`

The table container now focuses on:

- local table state
- selected contract/modal state
- connecting hooks to subcomponents

## Benefits

- row-action logic is isolated from filter UI
- modal composition stops cluttering the table render tree
- future changes to columns or toolbar do not require editing one giant file
- testing surface becomes more targeted

## Follow-up targets

- `communities-contracts-table/community-contracts-table.tsx`
- `communities-table/communities-table.tsx`
- other route-level files mixing modal orchestration with data-table internals
