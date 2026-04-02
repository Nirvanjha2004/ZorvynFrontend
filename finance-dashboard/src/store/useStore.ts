import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockApi } from '../api/mockApi'
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
    (set, get) => ({
      transactions: [],
      role: 'admin' as Role,
      filters: defaultFilters,
      activePage: 'dashboard' as ActivePage,
      darkMode: false,
      loading: true,
      viewMode: 'flat' as const,

      // Bootstrap: fetch from API on first load; skip if persisted data exists
      _bootstrap: async () => {
        if (get().transactions.length > 0) {
          set({ loading: false })
          return
        }
        try {
          const transactions = await mockApi.fetchTransactions()
          set({ transactions, loading: false })
        } catch {
          set({ loading: false })
        }
      },

      addTransaction: async (t: Omit<Transaction, 'id'> & { id?: string }) => {
        const created = t.id
          ? { ...t, id: t.id } as Transaction  // undo restore — keep original id
          : await mockApi.createTransaction(t)
        set((state) => ({ transactions: [...state.transactions, created] }))
      },

      updateTransaction: async (id: string, updates: Partial<Omit<Transaction, 'id'>>) => {
        const existing = get().transactions.find((t) => t.id === id)
        if (!existing) return
        const updated = await mockApi.updateTransaction(id, updates, existing)
        set((state) => ({
          transactions: state.transactions.map((t) => t.id === id ? updated : t),
        }))
      },

      deleteTransaction: async (id: string) => {
        await mockApi.deleteTransaction(id)
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }))
      },

      setRole: (role: Role) => set({ role }),

      setFilters: (filters: Partial<FilterState>) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),

      setActivePage: (activePage: ActivePage) => set({ activePage }),

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

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
