import { useState, useEffect } from 'react'
import type { Transaction } from '../types'
import { TransactionRow } from './TransactionRow'

const PAGE_SIZE = 8

interface TransactionListProps {
  transactions: Transaction[]
  isAdmin: boolean
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
  onAdd?: () => void
  paginate?: boolean // opt-in; grouped view passes false
}

export function TransactionList({
  transactions,
  isAdmin,
  onEdit,
  onDelete,
  onAdd,
  paginate = true,
}: TransactionListProps) {
  const [page, setPage] = useState(1)

  // Reset to page 1 whenever the transaction list changes (filter applied, etc.)
  useEffect(() => {
    setPage(1)
  }, [transactions])

  if (transactions.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-2xl">
          🔍
        </div>
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

  const totalPages = paginate ? Math.ceil(transactions.length / PAGE_SIZE) : 1
  const visible = paginate
    ? transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : transactions

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800/60">
              <th className="py-3 pl-5 pr-3 text-left text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
                Transaction
              </th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                Category
              </th>
              <th className="py-3 px-3 text-right text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider hidden md:table-cell">
                Type
              </th>
              <th className="py-3 pl-3 pr-5 text-right text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((t) => (
              <TransactionRow
                key={t.id}
                transaction={t}
                isAdmin={isAdmin}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls — only shown when paginate=true and more than one page */}
      {paginate && totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 dark:border-gray-800/60">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Showing{' '}
            <span className="font-medium text-gray-600 dark:text-gray-300">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, transactions.length)}
            </span>{' '}
            of{' '}
            <span className="font-medium text-gray-600 dark:text-gray-300">{transactions.length}</span>
          </p>

          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              ‹
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '…')[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('…')
                acc.push(p)
                return acc
              }, [])
              .map((item, idx) =>
                item === '…' ? (
                  <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                      page === item
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}

            {/* Next */}
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
