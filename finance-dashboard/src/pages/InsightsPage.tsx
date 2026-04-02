import { useStore } from '../store/useStore'
import { InsightCard } from '../components/InsightCard'
import {
  getHighestSpendingCategory, getMonthOverMonthChange,
  getAverageMonthlyExpense, getTotalIncome, getTotalExpenses,
  getSpendingByCategory, formatCurrency,
} from '../utils/finance'

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f97316']

function GoToTransactionsButton() {
  const setActivePage = useStore((s) => s.setActivePage)
  return (
    <button
      onClick={() => setActivePage('transactions')}
      className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
    >
      Go to Transactions →
    </button>
  )
}

export function InsightsPage() {
  const transactions = useStore((s) => s.transactions)

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Derived observations from your data</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/60 p-12 flex flex-col items-center gap-3 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-3xl">💡</div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No data available yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-600">Add some transactions to see insights</p>
          <GoToTransactionsButton />
        </div>
      </div>
    )
  }

  const topCategory = getHighestSpendingCategory(transactions)
  const mom         = getMonthOverMonthChange(transactions)
  const avgMonthly  = getAverageMonthlyExpense(transactions)
  const income      = getTotalIncome(transactions)
  const expenses    = getTotalExpenses(transactions)
  const cats        = getSpendingByCategory(transactions)
  const savingsRate = income > 0 ? (((income - expenses) / income) * 100).toFixed(1) : '0'

  const momPct = mom.previous > 0
    ? Math.abs(((mom.current - mom.previous) / mom.previous) * 100).toFixed(1)
    : null

  const momSubtext = momPct
    ? `${mom.direction === 'up' ? '↑' : '↓'} ${momPct}% vs last month (${formatCurrency(mom.previous)})`
    : 'No previous month to compare'

  const totalSpend = cats.reduce((s, c) => s + c.total, 0)

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Derived observations from your data</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard
          icon="🏆"
          label="Top Spending Category"
          value={topCategory ? topCategory.category : '—'}
          subtext={topCategory ? `${formatCurrency(topCategory.total)} total spent` : undefined}
          accent="amber"
        />
        <InsightCard
          icon={mom.direction === 'up' ? '📈' : mom.direction === 'down' ? '📉' : '➡️'}
          label="This Month's Expenses"
          value={formatCurrency(mom.current)}
          subtext={momSubtext}
          accent={mom.direction === 'up' ? 'red' : 'emerald'}
        />
        <InsightCard
          icon="📅"
          label="Avg Monthly Expense"
          value={formatCurrency(avgMonthly)}
          subtext="across all recorded months"
          accent="indigo"
        />
        <InsightCard
          icon="💰"
          label="Savings Rate"
          value={`${savingsRate}%`}
          subtext={`${formatCurrency(income - expenses)} saved of ${formatCurrency(income)} earned`}
          accent={parseFloat(savingsRate) >= 20 ? 'emerald' : parseFloat(savingsRate) >= 10 ? 'amber' : 'red'}
        />
      </div>

      {/* Spending breakdown bar chart */}
      {cats.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/60 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-5">Spending by Category</h2>
          <div className="flex flex-col gap-4">
            {cats.map((c, i) => (
              <div key={c.category} className="flex items-center gap-3">
                <span className="text-sm w-28 text-gray-600 dark:text-gray-400 truncate flex-shrink-0">{c.category}</span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(c.total / totalSpend) * 100}%`,
                      background: COLORS[i % COLORS.length],
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-20 text-right tabular-nums flex-shrink-0">
                  {formatCurrency(c.total)}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-600 w-8 text-right flex-shrink-0">
                  {((c.total / totalSpend) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
