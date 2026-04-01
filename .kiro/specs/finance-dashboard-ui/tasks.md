# Implementation Plan: Finance Dashboard UI

## Overview

Build the Finance Dashboard UI incrementally: project scaffold → data layer → pure computation functions → Zustand store → layout/navigation → Dashboard page → Transactions page → Insights page → role-based UI → polish and persistence.

## Tasks

- [x] 1. Scaffold the project
  - Run `npm create vite@latest finance-dashboard -- --template react-ts` and install dependencies: `tailwindcss`, `postcss`, `autoprefixer`, `recharts`, `zustand`, `uuid`
  - Initialize Tailwind (`npx tailwindcss init -p`) and configure `tailwind.config.js` with content paths
  - Install dev dependencies: `vitest`, `@vitest/ui`, `@testing-library/react`, `@testing-library/jest-dom`, `fast-check`, `jsdom`
  - Configure `vite.config.ts` for Vitest with jsdom environment
  - Set up `src/index.css` with Tailwind directives
  - _Requirements: 6.1, 6.2_

- [x] 2. Define data models and mock data
  - [x] 2.1 Create `src/types/index.ts` with all TypeScript interfaces: `Transaction`, `TransactionType`, `Category`, `Role`, `FilterState`, `AppState`
    - _Requirements: 2.1, 3.1_
  - [x] 2.2 Create `src/data/mockTransactions.ts` with ~20 seed transactions spanning 3 months, all categories, both types
    - _Requirements: 1.1, 1.2, 1.3_

- [-] 3. Implement pure finance computation functions
  - [x] 3.1 Create `src/utils/finance.ts` with all pure functions: `getTotalBalance`, `getTotalIncome`, `getTotalExpenses`, `getMonthlyTrend`, `getSpendingByCategory`, `getHighestSpendingCategory`, `getMonthOverMonthChange`, `getAverageMonthlyExpense`, `applyFilters`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.2, 2.3, 2.4, 2.5, 4.1, 4.2, 4.3_
  - [-] 3.2 Write property tests for finance.ts in `src/utils/finance.test.ts` using fast-check
    - **Property 1: Balance invariant** — generate random transaction lists, assert `getTotalBalance` = `getTotalIncome` − `getTotalExpenses` and all transactions are accounted for
    - **Validates: Requirements 1.1, 1.2, 1.3**
    - **Property 2: Filter correctness** — generate random transactions + filter combinations, assert all results satisfy all active filters and result length ≤ original
    - **Validates: Requirements 2.2, 2.3, 2.4**
    - **Property 3: Sort ordering** — generate random transactions + sort option, assert adjacent elements satisfy sort predicate
    - **Validates: Requirements 2.5**
    - **Property 6: Highest spending category consistency** — generate random expense transactions, assert highest category matches max of `getSpendingByCategory`
    - **Validates: Requirements 4.1**
    - **Property 7: Monthly trend coverage** — generate random transaction lists, assert `getMonthlyTrend` covers all distinct months
    - **Validates: Requirements 1.4**
    - **Property 8: Average monthly expense** — generate random expense transactions, assert average = total / distinct months
    - **Validates: Requirements 4.3**

- [ ] 4. Checkpoint — run all tests, ensure they pass before continuing
  - Run `npx vitest run` and confirm all tests pass. Ask the user if any questions arise.

- [ ] 5. Implement Zustand store
  - [ ] 5.1 Create `src/store/useStore.ts` with full `AppState` including all actions (`addTransaction`, `updateTransaction`, `setRole`, `setFilters`, `setActivePage`) and localStorage middleware (persist transactions and role)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [ ] 5.2 Write unit tests for store actions in `src/store/useStore.test.ts`
    - **Property 4: Add transaction round trip** — generate random valid transaction, call `addTransaction`, assert it appears in store with matching fields
    - **Validates: Requirements 3.5**
    - **Property 9: Filter state persists across navigation** — set filters, change `activePage`, assert filters unchanged
    - **Validates: Requirements 5.4**
    - **Property 10: LocalStorage round trip** — write store state, re-initialize from localStorage, assert equivalent state
    - **Validates: Requirements 5.5**

- [ ] 6. Build layout and navigation
  - [ ] 6.1 Create `src/components/Layout.tsx` — responsive sidebar + main content area (sidebar on desktop, top nav on mobile)
    - _Requirements: 6.1, 6.5_
  - [ ] 6.2 Create `src/components/Sidebar.tsx` — navigation links (Dashboard, Transactions, Insights) that call `setActivePage`, plus `RoleSelector`
    - _Requirements: 6.5_
  - [ ] 6.3 Create `src/components/RoleSelector.tsx` — dropdown to switch between Admin and Viewer roles, calls `setRole`
    - _Requirements: 3.1_
  - [ ] 6.4 Create shared components: `src/components/EmptyState.tsx` (icon + message), `src/components/Badge.tsx` (category/type pill)
    - _Requirements: 1.6, 2.6, 4.4, 6.3_
  - [ ] 6.5 Wire `App.tsx` to render `<Layout>` and conditionally render the active page based on `activePage` store state
    - _Requirements: 6.5_

- [ ] 7. Build Dashboard page
  - [ ] 7.1 Create `src/components/SummaryCard.tsx` — single metric card with label, formatted value, and optional trend icon
    - _Requirements: 1.1, 1.2, 1.3_
  - [ ] 7.2 Create `src/pages/DashboardPage.tsx` — renders three `SummaryCard` components using `getTotalBalance`, `getTotalIncome`, `getTotalExpenses`
    - _Requirements: 1.1, 1.2, 1.3, 1.6_
  - [ ] 7.3 Create `src/components/BalanceTrendChart.tsx` — Recharts `LineChart` using `getMonthlyTrend` data, responsive container, empty state when no data
    - _Requirements: 1.4, 1.6_
  - [ ] 7.4 Create `src/components/SpendingBreakdownChart.tsx` — Recharts `PieChart` using `getSpendingByCategory` data, legend, empty state when no data
    - _Requirements: 1.5, 1.6_
  - [ ] 7.5 Add both charts to `DashboardPage.tsx`
    - _Requirements: 1.4, 1.5_

- [ ] 8. Build Transactions page
  - [ ] 8.1 Create `src/components/FilterBar.tsx` — search input, type filter (All/Income/Expense), category filter dropdown, sort selector; all controls call `setFilters`
    - _Requirements: 2.2, 2.3, 2.4, 2.5_
  - [ ] 8.2 Create `src/components/TransactionRow.tsx` — single row showing date, description, category badge, amount (green for income, red for expense), edit button visible only when role is admin
    - _Requirements: 2.1, 3.2, 3.4, 6.4_
  - [ ] 8.3 Create `src/components/TransactionList.tsx` — renders filtered/sorted transactions using `applyFilters`, shows `<EmptyState>` when result is empty
    - _Requirements: 2.1, 2.6_
  - [ ] 8.4 Create `src/components/TransactionModal.tsx` — add/edit form modal with fields: date, description, amount, category, type; inline validation; calls `addTransaction` or `updateTransaction` on submit
    - _Requirements: 3.3, 3.5, 3.6_
  - [ ] 8.5 Create `src/pages/TransactionsPage.tsx` — composes `FilterBar`, `TransactionList`, add button (Admin only), and `TransactionModal`
    - _Requirements: 2.1, 3.3_
  - [ ] 8.6 Write unit tests for `TransactionModal` validation in `src/components/TransactionModal/TransactionModal.test.tsx`
    - Test: empty description rejected, missing amount rejected, negative amount rejected, zero amount rejected, valid form submits
    - _Requirements: 3.6_

- [ ] 9. Build Insights page
  - [ ] 9.1 Create `src/components/InsightCard.tsx` — reusable card with icon, label, and value
    - _Requirements: 4.1, 4.2, 4.3_
  - [ ] 9.2 Create `src/pages/InsightsPage.tsx` — renders three insight cards using `getHighestSpendingCategory`, `getMonthOverMonthChange`, `getAverageMonthlyExpense`; shows placeholder text when no transactions exist
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 10. Role-based UI — wire up and verify
  - [ ] 10.1 Audit all components to ensure add/edit controls are conditionally rendered based on `role` from the store; Viewer sees no add/edit buttons anywhere
    - _Requirements: 3.2, 3.3, 3.4_
  - [ ] 10.2 Write property test for role-based UI visibility in `src/store/useStore.test.ts`
    - **Property 5: Role-based UI visibility** — for role=viewer, assert add/edit controls absent; for role=admin, assert both present
    - **Validates: Requirements 3.2, 3.3, 3.4**

- [ ] 11. Final checkpoint — ensure all tests pass
  - Run `npx vitest run` and confirm all tests pass. Ask the user if any questions arise.

## Notes

- All tasks are required, including tests
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests use fast-check with minimum 100 iterations each
- Unit tests focus on specific examples, edge cases, and form validation
