import { useStore } from '../store/useStore'
import { InsightCard } from '../components/InsightCard'
import {
  getHighestSpendingCategory,
  getMonthOverMonthChange,
  getAverageMonthlyExpense,
  formatCurrency,
} from '../utils/finance'

export function InsightsPage() {
  const transactions = useStore((s) => s.transactions)

  const hasTransactions = transactions.length > 0

  const topCategory = getHighestSpendingCategory(transactions)
  const momChange = getMonthOverMonthChange(transactions)
  const avgMonthly = getAverageMonthlyExpense(transactions)

  const momIcon = momChange.direction === 'up' ? '📈' : momChange.direction === 'down' ? '📉' : '➡️'
  const momLabel =
    momChange.direction === 'up'
      ? `+${formatCurrency(momChange.delta)} vs last month`
      : momChange.direction === 'down'
      ? `${formatCurrency(momChange.delta)} vs last month`
      : 'No change vs last month'

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-gray-800">Insights</h1>

      {!hasTransactions ? (
        <p className="text-sm text-gray-400">No data available. Add some transactions to see insights.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InsightCard
            icon="🏆"
            label="Highest Spending Category"
            value={topCategory ? topCategory.category : '—'}
            subtext={topCategory ? formatCurrency(topCategory.total) + ' total' : undefined}
          />
          <InsightCard
            icon={momIcon}
            label="Month-over-Month"
            value={formatCurrency(momChange.current)}
            subtext={momLabel}
          />
          <InsightCard
            icon="📅"
            label="Avg Monthly Expense"
            value={formatCurrency(avgMonthly)}
            subtext="across all months"
          />
        </div>
      )}
    </div>
  )
}
