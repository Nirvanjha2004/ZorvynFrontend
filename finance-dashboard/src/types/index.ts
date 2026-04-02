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
  dateFrom: string
  dateTo: string
}

export type ActivePage = 'dashboard' | 'transactions' | 'insights'

export interface AppState {
  transactions: Transaction[]
  role: Role
  filters: FilterState
  activePage: ActivePage
  darkMode: boolean
  loading: boolean
  viewMode: 'flat' | 'grouped'
  // Public actions
  addTransaction: (t: Omit<Transaction, 'id'> & { id?: string }) => Promise<void>
  updateTransaction: (id: string, t: Partial<Omit<Transaction, 'id'>>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  setRole: (role: Role) => void
  setFilters: (filters: Partial<FilterState>) => void
  setActivePage: (page: ActivePage) => void
  toggleDarkMode: () => void
  setViewMode: (mode: 'flat' | 'grouped') => void
  // Internal bootstrap — called only from App.tsx on first load
  _bootstrap: () => Promise<void>
}

export interface MonthlyDataPoint {
  month: string
  income: number
  expenses: number
  balance: number
}

export interface CategoryDataPoint {
  category: string
  total: number
}

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error'
}
