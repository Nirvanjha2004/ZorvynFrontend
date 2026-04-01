import { useStore } from '../store/useStore'
import type { Category, TransactionType, FilterState } from '../types'

const categories: Category[] = [
  'Salary', 'Food', 'Rent', 'Entertainment', 'Transport',
  'Healthcare', 'Shopping', 'Utilities', 'Other',
]

export function FilterBar() {
  const filters = useStore((s) => s.filters)
  const setFilters = useStore((s) => s.setFilters)

  function update(partial: Partial<FilterState>) {
    setFilters(partial)
  }

  return (
    <div className="flex flex-wrap gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      {/* Search */}
      <input
        type="search"
        placeholder="Search transactions…"
        value={filters.search}
        onChange={(e) => update({ search: e.target.value })}
        aria-label="Search transactions"
        className="flex-1 min-w-40 text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      {/* Type filter */}
      <select
        value={filters.type}
        onChange={(e) => update({ type: e.target.value as TransactionType | 'all' })}
        aria-label="Filter by type"
        className="text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Category filter */}
      <select
        value={filters.category}
        onChange={(e) => update({ category: e.target.value as Category | 'all' })}
        aria-label="Filter by category"
        className="text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="all">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={filters.sortBy}
        onChange={(e) => update({ sortBy: e.target.value as FilterState['sortBy'] })}
        aria-label="Sort transactions"
        className="text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="date-desc">Date (Newest)</option>
        <option value="date-asc">Date (Oldest)</option>
        <option value="amount-desc">Amount (High→Low)</option>
        <option value="amount-asc">Amount (Low→High)</option>
      </select>
    </div>
  )
}
