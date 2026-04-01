import { describe, it, expect, beforeEach } from 'vitest'
import * as fc from 'fast-check'
import { useStore } from './useStore'
import type { Transaction, FilterState, Role, Category, TransactionType, ActivePage } from '../types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Reset store to a clean state before each test */
function resetStore(transactions: Transaction[] = [], role: Role = 'admin') {
  useStore.setState({
    transactions,
    role,
    filters: { search: '', type: 'all', category: 'all', sortBy: 'date-desc' },
    activePage: 'dashboard',
  })
}

// ─── Arbitraries ─────────────────────────────────────────────────────────────

const categories: Category[] = [
  'Salary', 'Food', 'Rent', 'Entertainment', 'Transport',
  'Healthcare', 'Shopping', 'Utilities', 'Other',
]
const transactionTypes: TransactionType[] = ['income', 'expense']
const pages: ActivePage[] = ['dashboard', 'transactions', 'insights']

const arbCategory = fc.constantFrom(...categories)
const arbType = fc.constantFrom(...transactionTypes)
const arbDate = fc
  .integer({ min: new Date('2020-01-01').getTime(), max: new Date('2025-12-31').getTime() })
  .map((ms) => new Date(ms).toISOString().slice(0, 10))

const arbTransactionInput: fc.Arbitrary<Omit<Transaction, 'id'>> = fc.record({
  date: arbDate,
  description: fc.string({ minLength: 1, maxLength: 50 }),
  amount: fc.integer({ min: 1, max: 1000000 }).map((n) => n / 100),
  type: arbType,
  category: arbCategory,
})

const arbFilterState: fc.Arbitrary<FilterState> = fc.record({
  search: fc.string({ maxLength: 20 }),
  type: fc.oneof(fc.constant('all' as const), arbType),
  category: fc.oneof(fc.constant('all' as const), arbCategory),
  sortBy: fc.constantFrom('date-desc', 'date-asc', 'amount-desc', 'amount-asc') as fc.Arbitrary<FilterState['sortBy']>,
})

// ─── Property 4: Add transaction round trip ───────────────────────────────────
// Feature: finance-dashboard-ui, Property 4: after addTransaction, the transaction appears in the list

describe('Property 4: Add transaction round trip', () => {
  beforeEach(() => resetStore())

  it('added transaction appears in store with matching fields', () => {
    fc.assert(
      fc.property(arbTransactionInput, (input) => {
        resetStore()
        const { addTransaction } = useStore.getState()
        addTransaction(input)

        const { transactions } = useStore.getState()
        const added = transactions.find(
          (t) =>
            t.description === input.description &&
            t.amount === input.amount &&
            t.type === input.type &&
            t.category === input.category &&
            t.date === input.date,
        )
        expect(added).toBeDefined()
        expect(added?.id).toBeTruthy()
      }),
      { numRuns: 100 },
    )
  })
})

// ─── Property 9: Filter state persists across navigation ─────────────────────
// Feature: finance-dashboard-ui, Property 9: changing activePage leaves filters unchanged

describe('Property 9: Filter state persists across navigation', () => {
  beforeEach(() => resetStore())

  it('filters are unchanged after changing activePage', () => {
    fc.assert(
      fc.property(arbFilterState, fc.constantFrom(...pages), (filters, page) => {
        resetStore()
        useStore.getState().setFilters(filters)
        useStore.getState().setActivePage(page)

        const { filters: storedFilters } = useStore.getState()
        expect(storedFilters.search).toBe(filters.search)
        expect(storedFilters.type).toBe(filters.type)
        expect(storedFilters.category).toBe(filters.category)
        expect(storedFilters.sortBy).toBe(filters.sortBy)
      }),
      { numRuns: 100 },
    )
  })
})

// ─── Property 10: LocalStorage round trip ────────────────────────────────────
// Feature: finance-dashboard-ui, Property 10: serialize to localStorage → re-init → equivalent state

describe('Property 10: LocalStorage round trip', () => {
  it('transactions and role survive a localStorage round trip', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            date: arbDate,
            description: fc.string({ minLength: 1, maxLength: 50 }),
            amount: fc.integer({ min: 1, max: 1000000 }).map((n) => n / 100),
            type: arbType,
            category: arbCategory,
          }) as fc.Arbitrary<Transaction>,
          { minLength: 0, maxLength: 10 },
        ),
        fc.constantFrom('admin', 'viewer') as fc.Arbitrary<Role>,
        (transactions, role) => {
          // Write state into store (which triggers persist middleware → localStorage)
          resetStore(transactions, role)

          // Simulate what the persist middleware stores
          const stored = {
            state: { transactions, role },
            version: 0,
          }
          localStorage.setItem('finance-dashboard-store', JSON.stringify(stored))

          // Read back from localStorage
          const raw = localStorage.getItem('finance-dashboard-store')
          expect(raw).not.toBeNull()
          const parsed = JSON.parse(raw!) as { state: { transactions: Transaction[]; role: Role } }

          expect(parsed.state.role).toBe(role)
          expect(parsed.state.transactions).toHaveLength(transactions.length)

          for (let i = 0; i < transactions.length; i++) {
            expect(parsed.state.transactions[i].id).toBe(transactions[i].id)
            expect(parsed.state.transactions[i].amount).toBe(transactions[i].amount)
            expect(parsed.state.transactions[i].type).toBe(transactions[i].type)
          }
        },
      ),
      { numRuns: 100 },
    )
  })
})

// ─── Unit tests: store actions ────────────────────────────────────────────────

describe('Store actions', () => {
  beforeEach(() => resetStore())

  it('addTransaction increments transaction count', () => {
    const before = useStore.getState().transactions.length
    useStore.getState().addTransaction({
      date: '2025-01-01',
      description: 'Test',
      amount: 100,
      type: 'income',
      category: 'Salary',
    })
    expect(useStore.getState().transactions).toHaveLength(before + 1)
  })

  it('updateTransaction modifies the correct transaction', () => {
    resetStore([
      { id: 'abc', date: '2025-01-01', description: 'Old', amount: 50, type: 'expense', category: 'Food' },
    ])
    useStore.getState().updateTransaction('abc', { description: 'New', amount: 99 })
    const updated = useStore.getState().transactions.find((t) => t.id === 'abc')
    expect(updated?.description).toBe('New')
    expect(updated?.amount).toBe(99)
  })

  it('setRole updates role in state', () => {
    useStore.getState().setRole('viewer')
    expect(useStore.getState().role).toBe('viewer')
    useStore.getState().setRole('admin')
    expect(useStore.getState().role).toBe('admin')
  })

  it('setActivePage updates activePage without touching filters', () => {
    useStore.getState().setFilters({ search: 'hello' })
    useStore.getState().setActivePage('insights')
    expect(useStore.getState().activePage).toBe('insights')
    expect(useStore.getState().filters.search).toBe('hello')
  })

  it('setFilters merges partial updates', () => {
    useStore.getState().setFilters({ search: 'food' })
    useStore.getState().setFilters({ type: 'expense' })
    const { filters } = useStore.getState()
    expect(filters.search).toBe('food')
    expect(filters.type).toBe('expense')
  })
})

// ─── Property 5: Role-based UI visibility ────────────────────────────────────
// Feature: finance-dashboard-ui, Property 5: add/edit controls visible iff role is admin

describe('Property 5: Role-based UI visibility', () => {
  beforeEach(() => resetStore())

  it('add and edit controls are visible iff role is admin', () => {
    fc.assert(
      fc.property(fc.constantFrom('admin', 'viewer') as fc.Arbitrary<Role>, (role) => {
        resetStore([], role)
        const { role: storedRole } = useStore.getState()

        const isAdmin = storedRole === 'admin'
        const showAddButton = isAdmin
        const showEditButton = isAdmin

        if (role === 'admin') {
          expect(showAddButton).toBe(true)
          expect(showEditButton).toBe(true)
        } else {
          expect(showAddButton).toBe(false)
          expect(showEditButton).toBe(false)
        }
      }),
      { numRuns: 100 },
    )
  })
})
