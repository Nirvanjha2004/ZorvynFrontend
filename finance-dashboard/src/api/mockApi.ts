import { mockTransactions } from '../data/mockTransactions'
import type { Transaction } from '../types'
import { v4 as uuidv4 } from 'uuid'

/** Simulates a network delay — skipped in test environment */
function delay(ms: number) {
  if (import.meta.env.MODE === 'test') return Promise.resolve()
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export const mockApi = {
  async fetchTransactions(): Promise<Transaction[]> {
    await delay(600)
    return [...mockTransactions]
  },

  async createTransaction(data: Omit<Transaction, 'id'>): Promise<Transaction> {
    await delay(300)
    return { ...data, id: uuidv4() }
  },

  async updateTransaction(id: string, data: Partial<Omit<Transaction, 'id'>>, existing: Transaction): Promise<Transaction> {
    await delay(300)
    return { ...existing, ...data, id }
  },

  async deleteTransaction(id: string): Promise<void> {
    await delay(200)
    // In a real API this would be a DELETE request
    void id
  },
}
