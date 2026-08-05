# React Query Data Flow Design

## Goal

Replace request-owned Redux state with React Query server-state management so Sales, Overview, and Stock data are shared across tabs, duplicate requests are deduplicated, and filtering does not trigger API calls.

## Current Problem

Each route-level component can mount independently and dispatch its own thunk. The existing loaded/requested range guards reduce some duplicate calls but keep request lifecycle state spread across Redux slices and individual components. MPN filtering is local filtering over fetched rows, but the API and UI responsibilities are coupled through thunks.

## Recommended Architecture

- React Query owns API data, request lifecycle, cache keys, stale time, retry behavior, and cancellation.
- Redux continues to own persisted Sales and Overview filters plus pagination controls because the existing UI already reads and writes those values there.
- Query functions call the existing axios operation functions. API operations remain the single HTTP boundary.
- Components read query results through focused hooks instead of dispatching fetch thunks in mount effects.
- Query keys are stable and parameterized:
  - `['sales', { DtFrom, DtTo }]`
  - `['overview', { DtFrom, DtTo }]`
  - `['stock']`
- Date changes create a new query key and therefore request fresh data. MPN changes only recompute filtered rows from the cached Sales/Stock result.
- Query configuration keeps fetched results available while navigating tabs, avoids refetch-on-window-focus, and uses a bounded stale period so returning to a tab is instant without making data permanently stale.

## Data Flow

1. The app creates one `QueryClient` and wraps the existing Redux provider and router with `QueryClientProvider`.
2. Sales and dashboard chart components call the same `useSalesQuery` for the active date range. React Query deduplicates simultaneous consumers.
3. Overview panels call the same `useOverviewQuery` for the active overview date range.
4. Stock calls `useStockQuery` once per cache lifetime and reuses its result after tab navigation.
5. Components derive MPN-filtered, sorted, and paginated rows with memoized selectors. No MPN value is included in a server query key.
6. Loading, errors, empty results, and export-button availability come directly from the query result and derived visible rows.

## Error and Request Behavior

- Existing axios operation functions and response shapes are preserved.
- Query functions throw the original request error so components can show the current error messages.
- Date queries are disabled until both dates exist.
- React Query may retry transient failures once; it must not retry invalid date input or repeatedly refetch on tab/window focus.
- Query results remain visible while a new date range is loading, with an `isFetching` indicator where the existing UI supports it.

## Testing

- Add unit tests for query-key construction and row filtering so partial MPN matching is verified without network access.
- Add component or hook-level tests for the core contract: same date range shares a query, a date change changes the query key, MPN changes do not invoke the API, and cached data remains available after unmount/remount.
- Run the existing lint and production build commands.
- Verify the dev proxy and the direct API boundary remain unchanged.

## Scope

This migration covers Sales, Overview, Stock, their shared API hooks, app provider setup, and focused tests. It does not redesign the UI, change endpoint contracts, or remove Redux entirely.
