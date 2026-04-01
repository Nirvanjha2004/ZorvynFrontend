import type { Transaction } from '../types'
import { Badge } from './Badge'
import { formatCurrency, formatDate } from '../utils/finance'

interface TransactionRowProps {
  transaction: Transaction
  isAdmin: boolean
  onEdit: (transaction: Transaction) => void
}

export function TransactionRow({ transaction, isAdmin, onEdit }: TransactionRowProps) {
  const amountColor = transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
  const amountPrefix = transaction.type === 'income' ? '+' : '-'

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4 text-sm text-gray-500 whitespace-nowrap">
        {formatDate(transaction.date)}
      </td>
      <td className="py-3 px-4 text-sm text-gray-800">
        {transaction.description}
      </td>
      <td className="py-3 px-4">
        <Badge label={transaction.category} variant="category" />
      </td>
      <td className="py-3 px-4">
        <Badge label={transaction.type} variant="type" />
      </td>
      <td className={`py-3 px-4 text-sm font-semibold text-right whitespace-nowrap ${amountColor}`}>
        {amountPrefix}{formatCurrency(transaction.amount)}
      </td>
      {isAdmin && (
        <td className="py-3 px-4 text-right">
          <button
            onClick={() => onEdit(transaction)}
            aria-label={`Edit ${transaction.description}`}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
          >
            Edit
          </button>
        </td>
      )}
    </tr>
  )
}
