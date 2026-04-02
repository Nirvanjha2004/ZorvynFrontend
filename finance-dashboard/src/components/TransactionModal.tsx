import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { Transaction, Category, TransactionType } from '../types'
import { validateTransaction } from './transactionValidation'
import type { FormErrors } from './transactionValidation'

const categories: Category[] = [
  'Salary', 'Food', 'Rent', 'Entertainment', 'Transport',
  'Healthcare', 'Shopping', 'Utilities', 'Other',
]

const categoryIcon: Record<string, string> = {
  Salary: '💼', Food: '🍔', Rent: '🏠', Entertainment: '🎬',
  Transport: '🚗', Healthcare: '💊', Shopping: '🛍️', Utilities: '⚡', Other: '📦',
}

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

const fieldClass = 'w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors'
const labelClass = 'block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide'

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
    const next = { ...values, [field]: value }
    setValues(next)
    if (touched) setErrors(validateTransaction(next))
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

  return createPortal(
    <div
      className="fixed inset-0 z-[50] flex items-end sm:items-center justify-center bg-black/40 animate-fade-in p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative z-[60] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md animate-slide-up border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800/60">
          <div>
            <h2 id="modal-title" className="text-base font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Transaction' : 'New Transaction'}
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {isEdit ? 'Update the transaction details' : 'Fill in the details below'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="px-6 py-5 flex flex-col gap-4">
          {/* Type toggle */}
          <div>
            <p className={labelClass}>Type</p>
            <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {(['expense', 'income'] as TransactionType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleChange('type', t)}
                  className={`flex-1 py-2.5 text-sm font-semibold capitalize transition-colors ${
                    values.type === t
                      ? t === 'income'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {t === 'income' ? '↑ Income' : '↓ Expense'}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="tx-desc" className={labelClass}>Description</label>
            <input
              id="tx-desc" type="text" value={values.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="e.g. Grocery Shopping"
              className={fieldClass}
              autoFocus
            />
            {errors.description && <p className="text-xs text-red-500 mt-1.5">{errors.description}</p>}
          </div>

          {/* Amount + Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="tx-amount" className={labelClass}>Amount ($)</label>
              <input
                id="tx-amount" type="number" min="0.01" step="0.01"
                value={values.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0.00"
                className={fieldClass}
              />
              {errors.amount && <p className="text-xs text-red-500 mt-1.5">{errors.amount}</p>}
            </div>
            <div>
              <label htmlFor="tx-date" className={labelClass}>Date</label>
              <input
                id="tx-date" type="date" value={values.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={fieldClass}
              />
              {errors.date && <p className="text-xs text-red-500 mt-1.5">{errors.date}</p>}
            </div>
          </div>

          {/* Category grid */}
          <div>
            <p className={labelClass}>Category</p>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleChange('category', c)}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                    values.category === c
                      ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span>{categoryIcon[c]}</span>
                  <span className="truncate">{c}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold transition-colors"
            >
              {isEdit ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
