import type { Transaction } from '../types'
import { Badge } from './Badge'
import { formatCurrency, formatDate } from '../utils/finance'

const categoryIcon: Record<string, string> = {
  Salary: '💼', Food: '🍔', Rent: '🏠', Entertainment: '🎬',
  Transport: '🚗', Healthcare: '💊', Shopping: '🛍️', Utilities: '⚡', Other: '📦',
}

interface TransactionRowProps {
  transaction: Transaction
  isAdmin: boolean
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export function TransactionRow({ transaction, isAdmin, onEdit, onDelete }: TransactionRowProps) {
  const isIncome = transaction.type === 'income'

  return (
    <tr className="group border-b border-gray-50 dark:border-gray-800/60 hover:bg-slate-50/80 dark:hover:bg-gray-800/30 transition-colors duration-100">
      {/* Icon + description */}
      <td className="py-3.5 pl-5 pr-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-base flex-shrink-0">
            {categoryIcon[transaction.category] ?? '📦'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{transaction.description}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(transaction.date)}</p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="py-3.5 px-3 hidden sm:table-cell">
        <Badge label={transaction.category} variant="category" />
      </td>

      {/* Amount */}
      <td className="py-3.5 px-3 text-right">
        <span className={`text-sm font-semibold tabular-nums ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'}`}>
          {isIncome ? '+' : '−'}{formatCurrency(transaction.amount)}
        </span>
      </td>

      {/* Type badge */}
      <td className="py-3.5 px-3 hidden md:table-cell">
        <Badge label={transaction.type} variant="type" />
      </td>

      {/* Actions — always visible on mobile, hover-reveal on desktop */}
      <td className="py-3.5 pl-3 pr-5">
        <div className="flex items-center justify-end gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
          {isAdmin ? (
            <>
              <button
                onClick={() => onEdit(transaction)}
                aria-label={`Edit ${transaction.description}`}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-medium px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(transaction.id)}
                aria-label={`Delete ${transaction.description}`}
                className="text-xs text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
              >
                Delete
              </button>
            </>
          ) : (
            <span
              title="Admin access required"
              className="text-xs text-gray-300 dark:text-gray-700 px-2.5 py-1.5 cursor-not-allowed select-none"
            >
              View only
            </span>
          )}
        </div>
      </td>
    </tr>
  )
}
