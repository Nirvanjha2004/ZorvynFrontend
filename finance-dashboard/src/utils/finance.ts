import type {
  Transaction,
  FilterState,
  MonthlyDataPoint,
  CategoryDataPoint,
} from '../types'

// ─── Aggregations ────────────────────────────────────────────────────────────

export function getTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
}

export function getTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
}

export function getTotalBalance(transactions: Transaction[]): number {
  return getTotalIncome(transactions) - getTotalExpenses(transactions)
}

// ─── Chart Data ───────────────────────────────────────────────────────────────

/** Returns one data point per distinct YYYY-MM present in transactions, sorted ascending. */
export function getMonthlyTrend(transactions: Transaction[]): MonthlyDataPoint[] {
  const map = new Map<string, { income: number; expenses: number }>()

  for (const t of transactions) {
    const month = t.date.slice(0, 7) // "YYYY-MM"
    const entry = map.get(month) ?? { income: 0, expenses: 0 }
    if (t.type === 'income') entry.income += t.amount
    else entry.expenses += t.amount
    map.set(month, entry)
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, { income, expenses }]) => ({
      month,
      income,
      expenses,
      balance: income - expenses,
    }))
}

/** Returns total expense amount per category, sorted descending by total. */
export function getSpendingByCategory(transactions: Transaction[]): CategoryDataPoint[] {
  const map = new Map<string, number>()

  for (const t of transactions) {
    if (t.type !== 'expense') continue
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
  }

  return Array.from(map.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
}

// ─── Insights ─────────────────────────────────────────────────────────────────

export function getHighestSpendingCategory(
  transactions: Transaction[],
): { category: string; total: number } | null {
  const breakdown = getSpendingByCategory(transactions)
  return breakdown.length > 0 ? breakdown[0] : null
}

export interface MonthOverMonthResult {
  current: number
  previous: number
  delta: number
  direction: 'up' | 'down' | 'same'
}

/**
 * Compares the two most recent months' total expenses.
 * "current" = latest month, "previous" = second-latest month.
 */
export function getMonthOverMonthChange(transactions: Transaction[]): MonthOverMonthResult {
  const trend = getMonthlyTrend(transactions)
  const expenseMonths = trend.filter((p) => p.expenses > 0)

  if (expenseMonths.length === 0) {
    return { current: 0, previous: 0, delta: 0, direction: 'same' }
  }

  const current = expenseMonths[expenseMonths.length - 1].expenses
  const previous =
    expenseMonths.length >= 2 ? expenseMonths[expenseMonths.length - 2].expenses : 0
  const delta = current - previous
  const direction = delta > 0 ? 'up' : delta < 0 ? 'down' : 'same'

  return { current, previous, delta, direction }
}

/**
 * Average monthly expense = total expenses / number of distinct months with expenses.
 */
export function getAverageMonthlyExpense(transactions: Transaction[]): number {
  const trend = getMonthlyTrend(transactions)
  const expenseMonths = trend.filter((p) => p.expenses > 0)
  if (expenseMonths.length === 0) return 0
  const total = expenseMonths.reduce((sum, p) => sum + p.expenses, 0)
  return total / expenseMonths.length
}

// ─── Filtering & Sorting ──────────────────────────────────────────────────────

export function applyFilters(
  transactions: Transaction[],
  filters: FilterState,
): Transaction[] {
  let result = [...transactions]

  // Type filter
  if (filters.type !== 'all') {
    result = result.filter((t) => t.type === filters.type)
  }

  // Category filter
  if (filters.category !== 'all') {
    result = result.filter((t) => t.category === filters.category)
  }

  // Search filter (description or category, case-insensitive)
  if (filters.search.trim() !== '') {
    const term = filters.search.trim().toLowerCase()
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term),
    )
  }

  // Date range filter
  if (filters.dateFrom) {
    result = result.filter((t) => t.date >= filters.dateFrom)
  }
  if (filters.dateTo) {
    result = result.filter((t) => t.date <= filters.dateTo)
  }

  // Sort
  switch (filters.sortBy) {
    case 'date-desc':
      result.sort((a, b) => b.date.localeCompare(a.date))
      break
    case 'date-asc':
      result.sort((a, b) => a.date.localeCompare(b.date))
      break
    case 'amount-desc':
      result.sort((a, b) => b.amount - a.amount)
      break
    case 'amount-asc':
      result.sort((a, b) => a.amount - b.amount)
      break
  }

  return result
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// ─── Grouping ─────────────────────────────────────────────────────────────────

/** Groups transactions by YYYY-MM, sorted descending (newest first). */
export function groupTransactionsByMonth(
  transactions: Transaction[],
): { month: string; transactions: Transaction[] }[] {
  const map = new Map<string, Transaction[]>()
  for (const t of transactions) {
    const month = t.date.slice(0, 7)
    const group = map.get(month) ?? []
    group.push(t)
    map.set(month, group)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([month, txs]) => ({ month, transactions: txs }))
}

// ─── Export helpers ───────────────────────────────────────────────────────────

export function exportToCSV(transactions: Transaction[]): string {
  const header = 'id,date,description,amount,type,category'
  const rows = transactions.map((t) =>
    [t.id, t.date, `"${t.description.replace(/"/g, '""')}"`, t.amount, t.type, t.category].join(','),
  )
  return [header, ...rows].join('\n')
}

export function exportToJSON(transactions: Transaction[]): string {
  return JSON.stringify(transactions, null, 2)
}
