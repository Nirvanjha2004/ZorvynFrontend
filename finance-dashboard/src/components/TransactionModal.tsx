import { useState, useEffect } from 'react'
import type { Transaction, Category, TransactionType } from '../types'
import { validateTransaction } from './transactionValidation'
import type { FormErrors } from './transactionValidation'

const categories: Category[] = [
  'Salary', 'Food', 'Rent', 'Entertainment', 'Transport',
  'Healthcare', 'Shopping', 'Utilities', 'Other',
]

interface FormValues {
  date: string
  description: string
  amount: string
  category: Category
  type: TransactionType
}

interface TransactionModalProps {
  transaction?: Transaction | null
  onSubmit: (data: Omit<Transaction, 'id'>) => void
  onClose: () => void
}

export function TransactionModal({ transaction, onSubmit, onClose }: TransactionModalProps) {
  const isEdit = Boolean(transaction)

  const [values, setValues] = useState<FormValues>({
    date: transaction?.date ?? new Date().toISOString().slice(0, 10),
    description: transaction?.description ?? '',
    amount: transaction?.amount?.toString() ?? '',
    category: transaction?.category ?? 'Food',
    type: transaction?.type ?? 'expense',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (transaction) {
      setValues({
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount.toString(),
        category: transaction.category,
        type: transaction.type,
      })
    }
  }, [transaction])

  function handleChange(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (touched) {
      setErrors(validateTransaction({ ...values, [field]: value }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    const errs = validateTransaction(values)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    onSubmit({
      date: values.date,
      description: values.description.trim(),
      amount: parseFloat(values.amount),
      category: values.category,
      type: values.type,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 id="modal-title" className="text-base font-semibold text-gray-800">
            {isEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {/* Date */}
          <div>
            <label htmlFor="tx-date" className="block text-xs font-medium text-gray-600 mb-1">Date</label>
            <input
              id="tx-date"
              type="date"
              value={values.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="tx-desc" className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <input
              id="tx-desc"
              type="text"
              value={values.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="e.g. Grocery Shopping"
              className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="tx-amount" className="block text-xs font-medium text-gray-600 mb-1">Amount ($)</label>
            <input
              id="tx-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={values.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="0.00"
              className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
          </div>

          {/* Type */}
          <div>
            <label htmlFor="tx-type" className="block text-xs font-medium text-gray-600 mb-1">Type</label>
            <select
              id="tx-type"
              value={values.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="tx-category" className="block text-xs font-medium text-gray-600 mb-1">Category</label>
            <select
              id="tx-category"
              value={values.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
            >
              {isEdit ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
