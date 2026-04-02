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
  addTransaction: (t: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, t: Partial<Omit<Transaction, 'id'>>) => void
  deleteTransaction: (id: string) => void
  setRole: (role: Role) => void
  setFilters: (filters: Partial<FilterState>) => void
  setActivePage: (page: ActivePage) => void
  toggleDarkMode: () => void
  setTransactions: (transactions: Transaction[]) => void
  setLoading: (loading: boolean) => void
  setViewMode: (mode: 'flat' | 'grouped') => void
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
