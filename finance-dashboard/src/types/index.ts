export type TransactionType = 'income' | 'expense'

export type Category =
  | 'Salary'
  | 'Food'
  | 'Rent'
  | 'Entertainment'
  | 'Transport'
  | 'Healthcare'
  | 'Shopping'
  | 'Utilities'
  | 'Other'

export interface Transaction {
  id: string
  date: string // ISO date "YYYY-MM-DD"
  description: string
  amount: number // always positive
  type: TransactionType
  category: Category
}

export type Role = 'admin' | 'viewer'

export type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'

export interface FilterState {
  search: string
  type: TransactionType | 'all'
  category: Category | 'all'
  sortBy: SortOption
}

export type ActivePage = 'dashboard' | 'transactions' | 'insights'

export interface AppState {
  transactions: Transaction[]
  role: Role
  filters: FilterState
  activePage: ActivePage
  addTransaction: (t: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, t: Partial<Omit<Transaction, 'id'>>) => void
  setRole: (role: Role) => void
  setFilters: (filters: Partial<FilterState>) => void
  setActivePage: (page: ActivePage) => void
}

// Derived data shapes used by charts and insights
export interface MonthlyDataPoint {
  month: string // "YYYY-MM"
  income: number
  expenses: number
  balance: number
}

export interface CategoryDataPoint {
  category: string
  total: number
}
