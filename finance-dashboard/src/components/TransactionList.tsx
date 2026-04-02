import type { Transaction } from '../types'
import { TransactionRow } from './TransactionRow'

interface TransactionListProps {
  transactions: Transaction[]
  isAdmin: boolean
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
  onAdd?: () => void
}

export function TransactionList({ transactions, isAdmin, onEdit, onDelete, onAdd }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-2xl">🔍</div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No transactions found</p>
        <p className="text-xs text-gray-400 dark:text-gray-600">Try adjusting your filters</p>
        {isAdmin && onAdd && (
          <button
            onClick={onAdd}
            className="mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            + Add a transaction
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800/60">
            <th className="py-3 pl-5 pr-3 text-left text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Transaction</th>
            <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider hidden sm:table-cell">Category</th>
            <th className="py-3 px-3 text-right text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Amount</th>
            <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider hidden md:table-cell">Type</th>
            <th className="py-3 pl-3 pr-5 text-right text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <TransactionRow key={t.id} transaction={t} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
