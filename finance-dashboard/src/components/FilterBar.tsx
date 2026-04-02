import { useStore } from '../store/useStore'
import { Select } from './Select'
import type { Category, TransactionType, FilterState } from '../types'
import type { SelectOption } from './Select'

const typeOptions: SelectOption[] = [
  { value: 'all',     label: 'All Types',  icon: '⚡' },
  { value: 'income',  label: 'Income',     icon: '↑' },
  { value: 'expense', label: 'Expense',    icon: '↓' },
]

const categoryOptions: SelectOption[] = [
  { value: 'all',           label: 'All Categories', icon: '🗂️' },
  { value: 'Salary',        label: 'Salary',         icon: '💼' },
  { value: 'Food',          label: 'Food',           icon: '🍔' },
  { value: 'Rent',          label: 'Rent',           icon: '🏠' },
  { value: 'Entertainment', label: 'Entertainment',  icon: '🎬' },
  { value: 'Transport',     label: 'Transport',      icon: '🚗' },
  { value: 'Healthcare',    label: 'Healthcare',     icon: '💊' },
  { value: 'Shopping',      label: 'Shopping',       icon: '🛍️' },
  { value: 'Utilities',     label: 'Utilities',      icon: '⚡' },
  { value: 'Other',         label: 'Other',          icon: '📦' },
]

const sortOptions: SelectOption[] = [
  { value: 'date-desc',   label: 'Newest first',   icon: '↓' },
  { value: 'date-asc',    label: 'Oldest first',   icon: '↑' },
  { value: 'amount-desc', label: 'Highest amount', icon: '↓' },
  { value: 'amount-asc',  label: 'Lowest amount',  icon: '↑' },
]

const inputClass = 'text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors'

export function FilterBar() {
  const filters    = useStore((s) => s.filters)
  const setFilters = useStore((s) => s.setFilters)

  const update = (p: Partial<FilterState>) => setFilters(p)
  const clear  = () => setFilters({ search: '', type: 'all', category: 'all', sortBy: 'date-desc', dateFrom: '', dateTo: '' })

  const activeCount = [
    filters.search,
    filters.type !== 'all',
    filters.category !== 'all',
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-sm p-4 flex flex-col gap-3">

      {/* Row 1: search + sort */}
      <div className="flex gap-2 items-center flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="search"
            placeholder="Search by description or category…"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            aria-label="Search transactions"
            className={`${inputClass} pl-8 w-full`}
          />
        </div>

        <Select
          value={filters.sortBy}
          onChange={(v) => update({ sortBy: v as FilterState['sortBy'] })}
          options={sortOptions}
          className="w-44"
        />
      </div>

      {/* Row 2: type + category + date range + clear */}
      <div className="flex gap-2 items-center flex-wrap">
        <Select
          value={filters.type}
          onChange={(v) => update({ type: v as TransactionType | 'all' })}
          options={typeOptions}
          className="w-36"
        />

        <Select
          value={filters.category}
          onChange={(v) => update({ category: v as Category | 'all' })}
          options={categoryOptions}
          className="w-44"
        />

        {/* Date range */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">From</span>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => update({ dateFrom: e.target.value })}
            aria-label="From date"
            className={inputClass}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">To</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => update({ dateTo: e.target.value })}
            aria-label="To date"
            className={inputClass}
          />
        </div>

        {activeCount > 0 && (
          <button
            onClick={clear}
            className="flex items-center gap-1.5 text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-3 py-2 rounded-xl border border-red-100 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
              {activeCount}
            </span>
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
