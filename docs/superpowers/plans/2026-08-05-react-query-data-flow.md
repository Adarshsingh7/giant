# React Query Data Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move Sales, Overview, and Stock server data to a shared React Query cache so date changes fetch fresh data, MPN filtering stays local, and tab changes do not reload already-cached data.

**Architecture:** Add one `QueryClientProvider` at the application root. Create focused query hooks for Sales, Overview, and Stock that call the existing operation functions and use stable parameterized keys. Keep Redux for persisted filters and pagination, remove fetch thunks and request metadata from component fetch flows, and derive filtered/sorted/paginated rows from query data.

**Tech Stack:** React 19, Redux Toolkit, React Query (`@tanstack/react-query`), axios, MUI, Day.js, Node test runner.

## Global Constraints

- Preserve existing API endpoints, query parameters, response shapes, and Vite `/api` proxy behavior.
- MPN input, including partial values, must never trigger an API request.
- A date-range change must create a new query key and fetch the changed range.
- Sales, Overview, and Stock data must remain available when their route component unmounts and remounts.
- Keep Redux for UI filters and pagination; do not remove the Redux provider.
- Do not change the visual layout or export filenames.

---

### Task 1: Add React Query dependency and application provider

**Files:**
- Modify: `package.json`
- Modify: `src/main.jsx`
- Test: `package.json` script validation through `npm install` and `npm run build`

**Interfaces:**
- Produces a single `QueryClient` configured with `staleTime: 5 * 60 * 1000`, `gcTime: 30 * 60 * 1000`, `refetchOnWindowFocus: false`, and `retry: 1`.

- [ ] **Step 1: Add the dependency and test script**

Run:

```powershell
npm install @tanstack/react-query
```

Add this script to `package.json`:

```json
"test": "node --test"
```

- [ ] **Step 2: Wrap the application with `QueryClientProvider`**

In `src/main.jsx`, import `QueryClient` and `QueryClientProvider`, create one client outside the render call, and place `QueryClientProvider` inside the existing Redux `Provider`:

```jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

- [ ] **Step 3: Verify provider setup**

Run `npm run lint` and `npm run build`. Expected: both exit with code 0.

- [ ] **Step 4: Commit**

```powershell
git add package.json package-lock.json src/main.jsx
git commit -m "feat: add React Query provider"
```

### Task 2: Create shared query hooks and pure row selectors

**Files:**
- Create: `src/queries/salesQueries.js`
- Create: `src/queries/stockQueries.js`
- Create: `src/utils/dataFilters.js`
- Test: `src/utils/dataFilters.test.js`
- Test: `src/queries/queryKeys.test.js`

**Interfaces:**
- `salesQueryKey({ DtFrom, DtTo })` returns `['sales', { DtFrom, DtTo }]`.
- `overviewQueryKey({ DtFrom, DtTo })` returns `['overview', { DtFrom, DtTo }]`.
- `stockQueryKey()` returns `['stock']`.
- `useSalesQuery({ DtFrom, DtTo })` returns the React Query result for `fetchSalesData({ DtFrom, DtTo })` and is disabled when either date is missing.
- `useOverviewQuery({ DtFrom, DtTo })` returns the React Query result for `fetchOverviewData({ DtFrom, DtTo })` and is disabled when either date is missing.
- `useStockQuery()` returns the React Query result for `fetchStockData()`.
- `filterByMpn(rows, mpn)` returns rows where `String(row.mpn ?? '').toLowerCase().includes(mpn.trim().toLowerCase())`.
- `sortRows(rows, { key, direction })` returns a new sorted array without mutating query data.

- [ ] **Step 1: Write failing selector and key tests**

Create `src/utils/dataFilters.test.js` with:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { filterByMpn, sortRows } from './dataFilters.js';

test('filterByMpn supports partial and case-insensitive MPN values', () => {
  const rows = [{ mpn: 'ABC-123' }, { mpn: 'XYZ-999' }, { mpn: null }];
  assert.deepEqual(filterByMpn(rows, 'bc-1'), [{ mpn: 'ABC-123' }]);
});

test('filterByMpn does not mutate the source array', () => {
  const rows = [{ mpn: 'ABC' }];
  assert.notStrictEqual(filterByMpn(rows, ''), rows);
});

test('sortRows sorts ascending and descending without mutating input', () => {
  const rows = [{ mpn: 'B' }, { mpn: 'A' }];
  assert.deepEqual(sortRows(rows, { key: 'mpn', direction: 'asc' }), [{ mpn: 'A' }, { mpn: 'B' }]);
  assert.deepEqual(sortRows(rows, { key: 'mpn', direction: 'desc' }), [{ mpn: 'B' }, { mpn: 'A' }]);
});
```

Create `src/queries/queryKeys.test.js` with assertions for all three key functions and for distinct date ranges producing distinct keys.

- [ ] **Step 2: Run the tests and verify failure**

Run `npm test`. Expected: FAIL because the selector and key modules do not exist yet.

- [ ] **Step 3: Implement selectors and query hooks**

Implement the pure selector functions in `src/utils/dataFilters.js`. Implement query hooks using `useQuery` and the existing operations:

```js
export const useSalesQuery = ({ DtFrom, DtTo }) => useQuery({
  queryKey: salesQueryKey({ DtFrom, DtTo }),
  queryFn: () => fetchSalesData({ DtFrom, DtTo }),
  enabled: Boolean(DtFrom && DtTo),
  placeholderData: (previousData) => previousData,
});
```

Use the same pattern for Overview and Stock, with `placeholderData` only where the query receives parameters. Keep query-key objects limited to the date values so MPN and pagination cannot cause a request.

- [ ] **Step 4: Run the focused tests**

Run `npm test`. Expected: all selector and key tests pass.

- [ ] **Step 5: Commit**

```powershell
git add src/queries src/utils/dataFilters.js src/utils/dataFilters.test.js
git commit -m "feat: add shared React Query hooks"
```

### Task 3: Migrate Sales and Stock pages to query data

**Files:**
- Modify: `src/components/sales/Sales.jsx`
- Modify: `src/components/stock/Stock.jsx`
- Modify: `src/slices/salesSlice.js`
- Modify: `src/slices/stockSlice.js`

**Interfaces:**
- Sales reads `data`, `isLoading`, `isFetching`, and `error` from `useSalesQuery` and uses Redux only for `salesFilters`.
- Stock reads `data`, `isLoading`, `isFetching`, and `error` from `useStockQuery` and uses Redux only for MPN/pagination controls.
- Existing export buttons stay disabled unless the visible filtered rows contain data and the active query is not loading or errored.

- [ ] **Step 1: Replace Sales fetch effect with `useSalesQuery`**

Remove the `getSales` dispatch effect and loaded/requested-range checks. Build `DtFrom` and `DtTo` from the Redux date filters and call `useSalesQuery({ DtFrom, DtTo })`. Keep the MPN debounce and filter it only through `filterByMpn` over `data ?? []`.

- [ ] **Step 2: Replace Stock fetch effect with `useStockQuery`**

Remove the `getStock` dispatch effect and `stockLoaded` dependency. Use `data ?? []` from `useStockQuery`, then apply `filterByMpn` and local sorting/pagination.

- [ ] **Step 3: Remove obsolete request-state reducers**

Remove `getSales`, `getOverview`, and `getStock` thunk handling plus `salesLoadedRange`, `salesRequestedRange`, `overviewLoadedRange`, `overviewRequestedRange`, and `stockLoaded` from Redux state. Leave filter, reset, pagination, and error-clearing actions only if still used by the UI.

- [ ] **Step 4: Verify behavior-focused tests**

Run `npm test`, `npm run lint`, and `npm run build`. Expected: focused tests pass and lint/build exit 0.

- [ ] **Step 5: Commit**

```powershell
git add src/components/sales/Sales.jsx src/components/stock/Stock.jsx src/slices/salesSlice.js src/slices/stockSlice.js
git commit -m "refactor: move sales and stock data to React Query"
```

### Task 4: Migrate Overview and dashboard charts to shared queries

**Files:**
- Modify: `src/components/home/Home1.jsx`
- Modify: `src/components/home/Home2.jsx`
- Modify: `src/components/home/Home3.jsx`
- Modify: `src/components/home/Home4.jsx`
- Modify: `src/slices/salesSlice.js`

**Interfaces:**
- Home1 and Home2 use the same `useOverviewQuery` cache entry for the active overview date range.
- Home3 and Home4 use the same `useSalesQuery` cache entry for the active overview date range.
- Date controls continue to update `overviewFilters`; only those date changes alter query keys.

- [ ] **Step 1: Migrate Home1 and Home2**

Remove their dispatch/effect request guards and use `useOverviewQuery({ DtFrom: startDate, DtTo: endDate })`. Keep their existing table transformations and loading props.

- [ ] **Step 2: Migrate Home3 and Home4**

Remove their dispatch/effect request guards and use `useSalesQuery({ DtFrom: startDate, DtTo: endDate })`. Keep their existing chart aggregation and render output.

- [ ] **Step 3: Confirm Redux retains only filters**

Remove unused thunk imports and request metadata references from the sales slice. Confirm `setOverviewFilters` still persists the date range used by all four dashboard panels.

- [ ] **Step 4: Verify duplicate-consumer behavior**

Run `npm test`, `npm run lint`, and `npm run build`. Inspect the resulting source to confirm no dashboard component dispatches a data-fetch thunk and all four consumers use the same query-key helper for equal date ranges.

- [ ] **Step 5: Commit**

```powershell
git add src/components/home src/slices/salesSlice.js
git commit -m "refactor: share dashboard data through React Query"
```

### Task 5: End-to-end local verification and cleanup

**Files:**
- Modify: `README.md` only if the local API startup requirement is undocumented.
- Modify: `vite.config.js` only if the existing `/api` proxy is not preserved by the migration.

**Interfaces:**
- `npm run dev` serves the app on port 5173 and proxies `/api` requests to `http://82.71.89.70:5100`.
- A date change causes one request for the new range; changing only MPN causes zero requests.
- Navigating Sales to Stock and back reuses cached data while it is fresh.

- [ ] **Step 1: Run static verification**

Run `npm test`, `npm run lint`, and `npm run build`. Record the actual pass/fail output before claiming completion.

- [ ] **Step 2: Start a local preview server**

Run `npm run dev -- --host 127.0.0.1` in a separate process and verify the printed URL is reachable. Do not change the API target or expose credentials.

- [ ] **Step 3: Exercise the three request flows**

In the browser Network panel:

1. Open Overview and confirm one Overview request and one Sales request are shared by the dashboard consumers.
2. Change only the MPN on Sales and confirm the visible rows update without a new request.
3. Change a Sales date and confirm one new Sales request for that date range.
4. Switch Sales/Stock/Overview tabs and confirm fresh cached data renders without another request.

- [ ] **Step 4: Check the final diff**

Run `git diff --check` and `git status --short`. Confirm only the React Query migration, tests, docs, and required dependency lockfile changes are present.

- [ ] **Step 5: Commit the final verification-ready state**

```powershell
git add package.json package-lock.json src docs
git commit -m "refactor: manage API data with React Query"
```
