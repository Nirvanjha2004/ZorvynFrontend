import { mockTransactions } from '../data/mockTransactions'
import type { Transaction } from '../types'

/** Simulates a network delay */
function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export const mockApi = {
  async fetchTransactions(): Promise<Transaction[]> {
    await delay(600)
    return [...mockTransactions]
  },

  async createTransaction(data: Omit<Transaction, 'id'>): Promise<Transaction> {
    await delay(300)
    const { v4: uuidv4 } = await import('uuid')
    return { ...data, id: uuidv4() }
  },

  async updateTransaction(id: string, data: Partial<Omit<Transaction, 'id'>>): Promise<Transaction> {
    await delay(300)
    const existing = mockTransactions.find((t) => t.id === id)
    if (!existing) throw new Error(`Transaction ${id} not found`)
    return { ...existing, ...data }
  },
}
