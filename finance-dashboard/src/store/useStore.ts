import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { AppState, Transaction, Role, FilterState, ActivePage } from '../types'

const defaultFilters: FilterState = {
  search: '',
  type: 'all',
  category: 'all',
  sortBy: 'date-desc',
  dateFrom: '',
  dateTo: '',
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      transactions: [],
      role: 'admin' as Role,
      filters: defaultFilters,
      activePage: 'dashboard' as ActivePage,
      darkMode: false,
      loading: true,
      viewMode: 'flat' as const,

      addTransaction: (t: Omit<Transaction, 'id'>) =>
        set((state) => ({
          transactions: [...state.transactions, { ...t, id: uuidv4() }],
        })),

      updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id'>>) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t,
          ),
        })),

      deleteTransaction: (id: string) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      setRole: (role: Role) => set({ role }),

      setFilters: (filters: Partial<FilterState>) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      setActivePage: (activePage: ActivePage) => set({ activePage }),

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      setTransactions: (transactions: Transaction[]) => set({ transactions }),

      setLoading: (loading: boolean) => set({ loading }),

      setViewMode: (viewMode) => set({ viewMode }),
    }),
    {
      name: 'finance-dashboard-store',
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        darkMode: state.darkMode,
        viewMode: state.viewMode,
      }),
    },
  ),
)
