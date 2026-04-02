import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { FilterBar } from '../components/FilterBar'
import { TransactionList } from '../components/TransactionList'
import { TransactionModal } from '../components/TransactionModal'
import { useToast } from '../hooks/useToast'
import { applyFilters, groupTransactionsByMonth, exportToCSV, exportToJSON, formatCurrency } from '../utils/finance'
import type { Transaction } from '../types'

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

const btnOutline = 'text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'

export function TransactionsPage() {
  const transactions      = useStore((s) => s.transactions)
  const filters           = useStore((s) => s.filters)
  const role              = useStore((s) => s.role)
  const viewMode          = useStore((s) => s.viewMode)
  const setViewMode       = useStore((s) => s.setViewMode)
  const addTransaction    = useStore((s) => s.addTransaction)
  const updateTransaction = useStore((s) => s.updateTransaction)
  const deleteTransaction = useStore((s) => s.deleteTransaction)
  const toast             = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)

  const isAdmin  = role === 'admin'
  const filtered = applyFilters(transactions, filters)
  const grouped  = groupTransactionsByMonth(filtered)

  // Keyboard shortcut: N to add transaction
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!isAdmin) return
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        setEditingTx(null)
        setModalOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isAdmin])

  function handleEdit(t: Transaction) { setEditingTx(t); setModalOpen(true) }
  function handleAdd()                { setEditingTx(null); setModalOpen(true) }

  function handleDelete(id: string) {
    const tx = transactions.find((t) => t.id === id)
    if (!tx) return

    // Optimistically remove from store
    deleteTransaction(id)

    // Show toast with 5-second undo window
    toast(
      `"${tx.description}" deleted`,
      'success',
      {
        label: 'Undo',
        onUndo: () => {
          // Re-add the deleted transaction with its original id
          addTransaction({ ...tx })
        },
      },
    )
  }

  function handleSubmit(data: Omit<Transaction, 'id'>) {
    if (editingTx) {
      updateTransaction(editingTx.id, data)
      toast('Transaction updated', 'success')
    } else {
      addTransaction(data)
      toast('Transaction added', 'success')
    }
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {filtered.length} of {transactions.length} transactions
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View toggle */}
          <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden text-xs">
            {(['flat', 'grouped'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-2 font-medium transition-colors ${
                  viewMode === m
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {m === 'flat' ? 'List' : 'By Month'}
              </button>
            ))}
          </div>

          <button onClick={() => downloadFile(exportToCSV(filtered), 'transactions.csv', 'text/csv')} className={btnOutline}>↓ CSV</button>
          <button onClick={() => downloadFile(exportToJSON(filtered), 'transactions.json', 'application/json')} className={btnOutline}>↓ JSON</button>

          {isAdmin ? (
            <button
              onClick={handleAdd}
              title="Press N to open quickly"
              className="text-sm font-medium px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white transition-colors"
            >
              + Add Transaction
            </button>
          ) : (
            <button
              disabled
              title="Admin access required"
              className="text-sm font-medium px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
            >
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <FilterBar />

      {/* Table */}
      {viewMode === 'flat' ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-sm overflow-hidden">
          <TransactionList transactions={filtered} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} onAdd={handleAdd} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {grouped.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-sm overflow-hidden">
              <TransactionList transactions={[]} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} onAdd={handleAdd} />
            </div>
          ) : grouped.map(({ month, transactions: txs }) => {
            const inc = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
            const exp = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
            return (
              <div key={month} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800/60 bg-slate-50 dark:bg-gray-800/50">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{month}</span>
                  <div className="flex gap-4 text-xs font-medium">
                    <span className="text-emerald-600 dark:text-emerald-400">+{formatCurrency(inc)}</span>
                    <span className="text-red-500 dark:text-red-400">−{formatCurrency(exp)}</span>
                  </div>
                </div>
                <TransactionList transactions={txs} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} />
              </div>
            )
          })}
        </div>
      )}

      {modalOpen && (
        <TransactionModal transaction={editingTx} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} />
      )}
    </div>
  )
}
