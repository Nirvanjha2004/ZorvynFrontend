import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { mockTransactions } from '../data/mockTransactions'
import type { AppState, Transaction, Role, FilterState, ActivePage } from '../types'

const defaultFilters: FilterState = {
  search: '',
  type: 'all',
  category: 'all',
  sortBy: 'date-desc',
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      transactions: mockTransactions,
      role: 'admin' as Role,
      filters: defaultFilters,
      activePage: 'dashboard' as ActivePage,

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

      setRole: (role: Role) => set({ role }),

      setFilters: (filters: Partial<FilterState>) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      setActivePage: (activePage: ActivePage) => set({ activePage }),
    }),
    {
      name: 'finance-dashboard-store',
      // Only persist transactions and role — filters and activePage reset on reload
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
      }),
    },
  ),
)
