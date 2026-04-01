import type { Transaction } from '../types'
import { TransactionRow } from './TransactionRow'
import { EmptyState } from './EmptyState'

interface TransactionListProps {
  transactions: Transaction[]
  isAdmin: boolean
  onEdit: (transaction: Transaction) => void
}

export function TransactionList({ transactions, isAdmin, onEdit }: TransactionListProps) {
  if (transactions.length === 0) {
    return <EmptyState message="No transactions match your filters" icon="🔍" />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="py-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
            <th className="py-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
            <th className="py-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
            <th className="py-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
            <th className="py-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Amount</th>
            {isAdmin && <th className="py-2 px-4" />}
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <TransactionRow key={t.id} transaction={t} isAdmin={isAdmin} onEdit={onEdit} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
