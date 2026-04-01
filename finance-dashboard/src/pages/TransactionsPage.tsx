import { useState } from 'react'
import { useStore } from '../store/useStore'
import { FilterBar } from '../components/FilterBar'
import { TransactionList } from '../components/TransactionList'
import { TransactionModal } from '../components/TransactionModal'
import { applyFilters } from '../utils/finance'
import type { Transaction } from '../types'

export function TransactionsPage() {
  const transactions = useStore((s) => s.transactions)
  const filters = useStore((s) => s.filters)
  const role = useStore((s) => s.role)
  const addTransaction = useStore((s) => s.addTransaction)
  const updateTransaction = useStore((s) => s.updateTransaction)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const isAdmin = role === 'admin'
  const filtered = applyFilters(transactions, filters)

  function handleEdit(t: Transaction) {
    setEditingTransaction(t)
    setModalOpen(true)
  }

  function handleAdd() {
    setEditingTransaction(null)
    setModalOpen(true)
  }

  function handleSubmit(data: Omit<Transaction, 'id'>) {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data)
    } else {
      addTransaction(data)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Transactions</h1>
        {isAdmin && (
          <button
            onClick={handleAdd}
            className="text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
          >
            + Add Transaction
          </button>
        )}
      </div>

      <FilterBar />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <TransactionList transactions={filtered} isAdmin={isAdmin} onEdit={handleEdit} />
      </div>

      {modalOpen && (
        <TransactionModal
          transaction={editingTransaction}
          onSubmit={handleSubmit}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
