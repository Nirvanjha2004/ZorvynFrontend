import { describe, it, expect } from 'vitest'
import { validateTransaction } from '../transactionValidation'

const validBase = { date: '2025-01-15', description: 'Groceries', amount: '50' }

describe('TransactionModal validation', () => {
  it('accepts a valid form', () => {
    const errors = validateTransaction(validBase)
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('rejects empty description', () => {
    const errors = validateTransaction({ ...validBase, description: '' })
    expect(errors.description).toBeTruthy()
  })

  it('rejects whitespace-only description', () => {
    const errors = validateTransaction({ ...validBase, description: '   ' })
    expect(errors.description).toBeTruthy()
  })

  it('rejects missing amount', () => {
    const errors = validateTransaction({ ...validBase, amount: '' })
    expect(errors.amount).toBeTruthy()
  })

  it('rejects negative amount', () => {
    const errors = validateTransaction({ ...validBase, amount: '-10' })
    expect(errors.amount).toBeTruthy()
  })

  it('rejects zero amount', () => {
    const errors = validateTransaction({ ...validBase, amount: '0' })
    expect(errors.amount).toBeTruthy()
  })

  it('rejects non-numeric amount', () => {
    const errors = validateTransaction({ ...validBase, amount: 'abc' })
    expect(errors.amount).toBeTruthy()
  })

  it('rejects missing date', () => {
    const errors = validateTransaction({ ...validBase, date: '' })
    expect(errors.date).toBeTruthy()
  })
})
