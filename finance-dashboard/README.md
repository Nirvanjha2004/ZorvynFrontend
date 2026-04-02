# FinanceOS — Finance Dashboard

A production-grade personal finance dashboard built with React 18, TypeScript, Tailwind CSS, Recharts, and Zustand.

![FinanceOS Dashboard](https://placehold.co/1200x630/6366f1/ffffff?text=FinanceOS+Dashboard)

## Features

- **Dashboard overview** — summary cards (balance, income, expenses) with MoM trend, area chart for monthly trends, donut chart for spending breakdown
- **Transactions** — full CRUD (add, edit, delete) with toast feedback and undo-on-delete, advanced filtering (type, category, date range, search), sort, CSV/JSON export, grouped-by-month view
- **Insights** — top spending category, month-over-month comparison, average monthly expense, savings rate, category breakdown bar chart
- **Role-based UI** — Admin can add/edit/delete; Viewer sees read-only mode with disabled controls and tooltips
- **Dark mode** — full dark theme, persisted to localStorage
- **Mock API** — simulated network latency on first load with loading skeletons
- **Custom dropdowns** — fully styled, portal-rendered Select component with keyboard support
- **Responsive** — mobile drawer, tablet 2-col, desktop 3-col layouts

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand with persist middleware |
| Charts | Recharts |
| Testing | Vitest + fast-check (property-based) |
| Build | Vite |

## 🐳 Running with Docker

```bash
docker-compose up --build
```
port = 3000
## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
  api/          # Mock API layer (simulated fetch with delay)
  components/   # Reusable UI components
  data/         # Seed transaction data
  hooks/        # Custom hooks (useToast)
  pages/        # Page-level components (Dashboard, Transactions, Insights)
  store/        # Zustand store + tests
  types/        # TypeScript interfaces
  utils/        # Pure finance computation functions + tests
```

## Role-Based Access Control

Switch roles using the dropdown in the sidebar:

- **Admin** — can add, edit, and delete transactions. Press `N` anywhere on the Transactions page to quickly open the add modal.
- **Viewer** — read-only mode. Add/edit/delete controls are hidden or disabled with tooltips.

Role selection is persisted to localStorage.

## Testing

The project uses a dual testing approach:

- **Unit tests** — specific examples and edge cases (`finance.test.ts`, `useStore.test.ts`, `TransactionModal.test.tsx`)
- **Property-based tests** — universal correctness properties using [fast-check](https://github.com/dubzzz/fast-check)

```bash
npm test          # run all tests once
npm run test:watch  # watch mode
```

Key properties tested:
- Balance invariant: `getTotalBalance = getTotalIncome − getTotalExpenses`
- Filter correctness: all results satisfy all active filters
- Sort ordering: adjacent elements satisfy sort predicate
- Add transaction round trip: added transaction appears in store with matching fields
- LocalStorage round trip: serialize → re-init → equivalent state
