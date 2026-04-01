import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  getTotalBalance,
  getTotalIncome,
  getTotalExpenses,
  getMonthlyTrend,
  getSpendingByCategory,
  getHighestSpendingCategory,
  getAverageMonthlyExpense,
  applyFilters,
} from './finance'
import type { Transaction, FilterState, Category, TransactionType, SortOption } from '../types'

// ─── Arbitraries ─────────────────────────────────────────────────────────────

const categories: Category[] = [
  'Salary', 'Food', 'Rent', 'Entertainment', 'Transport',
  'Healthcare', 'Shopping', 'Utilities', 'Other',
]
const transactionTypes: TransactionType[] = ['income', 'expense']
const sortOptions: SortOption[] = ['date-desc', 'date-asc', 'amount-desc', 'amount-asc']

const arbCategory = fc.constantFrom(...categories)
const arbType = fc.constantFrom(...transactionTypes)

/** Generates a valid ISO date string between 2020-01-01 and 2025-12-31 */
const arbDate = fc.date({
  min: new Date('2020-01-01'),
  max: new Date('2025-12-31'),
}).map((d) => d.toISOString().slice(0, 10))

const arbTransaction: fc.Arbitrary<Transaction> = fc.record({
  id: fc.uuid(),
  date: arbDate,
  description: fc.string({ minLength: 1, maxLength: 50 }),
  amount: fc.float({ min: Math.fround(0.01), max: Math.fround(100000), noNaN: true }),
  type: arbType,
  category: arbCategory,
})

const arbTransactions = fc.array(arbTransaction, { minLength: 0, maxLength: 30 })

const arbFilterState: fc.Arbitrary<FilterState> = fc.record({
  search: fc.string({ maxLength: 20 }),
  type: fc.oneof(fc.constant('all' as const), arbType),
  category: fc.oneof(fc.constant('all' as const), arbCategory),
  sortBy: fc.constantFrom(...sortOptions),
})

// ─── Property 1: Balance invariant ───────────────────────────────────────────
// Feature: finance-dashboard-ui, Property 1: balance = income - expenses, all transactions accounted for

describe('Property 1: Balance invariant', () => {
  it('getTotalBalance equals getTotalIncome minus getTotalExpenses', () => {
    fc.assert(
      fc.property(arbTransactions, (transactions) => {
        const balance = getTotalBalance(transactions)
        const income = getTotalIncome(transactions)
        const expenses = getTotalExpenses(transactions)

        // balance = income - expenses
        expect(balance).toBeCloseTo(income - expenses, 5)

        // every transaction is accounted for
        const sumAll = transactions.reduce((sum, t) => sum + t.amount, 0)
        expect(income + expenses).toBeCloseTo(sumAll, 5)
      }),
      { numRuns: 200 },
    )
  })
})

// ─── Property 2: Filter correctness ──────────────────────────────────────────
// Feature: finance-dashboard-ui, Property 2: all results satisfy all active filters

describe('Property 2: Filter correctness', () => {
  it('every result satisfies all active filter conditions and result length <= original', () => {
    fc.assert(
      fc.property(arbTransactions, arbFilterState, (transactions, filters) => {
        const result = applyFilters(transactions, filters)

        // result is a subset
        expect(result.length).toBeLessThanOrEqual(transactions.length)

        for (const t of result) {
          // type filter
          if (filters.type !== 'all') {
            expect(t.type).toBe(filters.type)
          }
          // category filter
          if (filters.category !== 'all') {
            expect(t.category).toBe(filters.category)
          }
          // search filter
          if (filters.search.trim() !== '') {
            const term = filters.search.trim().toLowerCase()
            const matches =
              t.description.toLowerCase().includes(term) ||
              t.category.toLowerCase().includes(term)
            expect(matches).toBe(true)
          }
        }
      }),
      { numRuns: 200 },
    )
  })
})

// ─── Property 3: Sort ordering ────────────────────────────────────────────────
// Feature: finance-dashboard-ui, Property 3: result is correctly ordered

describe('Property 3: Sort ordering', () => {
  it('adjacent elements satisfy the sort predicate', () => {
    fc.assert(
      fc.property(
        arbTransactions,
        fc.constantFrom(...sortOptions),
        (transactions, sortBy) => {
          const filters: FilterState = {
            search: '',
            type: 'all',
            category: 'all',
            sortBy,
          }
          const result = applyFilters(transactions, filters)

          for (let i = 0; i < result.length - 1; i++) {
            const a = result[i]
            const b = result[i + 1]
            switch (sortBy) {
              case 'date-desc':
                expect(a.date.localeCompare(b.date)).toBeGreaterThanOrEqual(0)
                break
              case 'date-asc':
                expect(a.date.localeCompare(b.date)).toBeLessThanOrEqual(0)
                break
              case 'amount-desc':
                expect(a.amount).toBeGreaterThanOrEqual(b.amount)
                break
              case 'amount-asc':
                expect(a.amount).toBeLessThanOrEqual(b.amount)
                break
            }
          }
        },
      ),
      { numRuns: 200 },
    )
  })
})

// ─── Property 6: Highest spending category consistency ───────────────────────
// Feature: finance-dashboard-ui, Property 6: highest category matches max of getSpendingByCategory

describe('Property 6: Highest spending category consistency', () => {
  it('getHighestSpendingCategory returns the category with the max total', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            date: arbDate,
            description: fc.string({ minLength: 1 }),
            amount: fc.float({ min: Math.fround(0.01), max: Math.fround(10000), noNaN: true }),
            type: fc.constant('expense' as const),
            category: arbCategory,
          }),
          { minLength: 1, maxLength: 20 },
        ),
        (transactions) => {
          const highest = getHighestSpendingCategory(transactions)
          const breakdown = getSpendingByCategory(transactions)

          expect(highest).not.toBeNull()
          if (!highest) return

          const maxTotal = Math.max(...breakdown.map((c) => c.total))
          expect(highest.total).toBeCloseTo(maxTotal, 5)
        },
      ),
      { numRuns: 200 },
    )
  })
})

// ─── Property 7: Monthly trend coverage ──────────────────────────────────────
// Feature: finance-dashboard-ui, Property 7: monthly trend covers all distinct months

describe('Property 7: Monthly trend coverage', () => {
  it('every distinct month in transactions appears in getMonthlyTrend', () => {
    fc.assert(
      fc.property(arbTransactions, (transactions) => {
        const trend = getMonthlyTrend(transactions)
        const trendMonths = new Set(trend.map((p) => p.month))
        const txMonths = new Set(transactions.map((t) => t.date.slice(0, 7)))

        // every transaction month appears in trend
        for (const m of txMonths) {
          expect(trendMonths.has(m)).toBe(true)
        }

        // no fabricated months
        for (const m of trendMonths) {
          expect(txMonths.has(m)).toBe(true)
        }
      }),
      { numRuns: 200 },
    )
  })
})

// ─── Property 8: Average monthly expense computation ─────────────────────────
// Feature: finance-dashboard-ui, Property 8: average = total / distinct expense months

describe('Property 8: Average monthly expense computation', () => {
  it('getAverageMonthlyExpense equals total expenses / distinct expense months', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            date: arbDate,
            description: fc.string({ minLength: 1 }),
            amount: fc.float({ min: Math.fround(0.01), max: Math.fround(10000), noNaN: true }),
            type: fc.constant('expense' as const),
            category: arbCategory,
          }),
          { minLength: 1, maxLength: 20 },
        ),
        (transactions) => {
          const avg = getAverageMonthlyExpense(transactions)
          const total = getTotalExpenses(transactions)
          const distinctMonths = new Set(transactions.map((t) => t.date.slice(0, 7))).size

          expect(avg).toBeCloseTo(total / distinctMonths, 5)
        },
      ),
      { numRuns: 200 },
    )
  })
})

// ─── Unit tests: edge cases ───────────────────────────────────────────────────

describe('Edge cases', () => {
  it('empty transaction list returns zero balance', () => {
    expect(getTotalBalance([])).toBe(0)
    expect(getTotalIncome([])).toBe(0)
    expect(getTotalExpenses([])).toBe(0)
  })

  it('getHighestSpendingCategory returns null for empty list', () => {
    expect(getHighestSpendingCategory([])).toBeNull()
  })

  it('getAverageMonthlyExpense returns 0 for empty list', () => {
    expect(getAverageMonthlyExpense([])).toBe(0)
  })

  it('getMonthlyTrend returns empty array for empty list', () => {
    expect(getMonthlyTrend([])).toEqual([])
  })

  it('applyFilters with all=all and empty search returns all transactions', () => {
    const txs: Transaction[] = [
      { id: '1', date: '2025-01-01', description: 'Test', amount: 100, type: 'income', category: 'Salary' },
    ]
    const filters: FilterState = { search: '', type: 'all', category: 'all', sortBy: 'date-desc' }
    expect(applyFilters(txs, filters)).toHaveLength(1)
  })
})
