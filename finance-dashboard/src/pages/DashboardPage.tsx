import { useStore } from '../store/useStore'
import { SummaryCard } from '../components/SummaryCard'
import { BalanceTrendChart } from '../components/BalanceTrendChart'
import { SpendingBreakdownChart } from '../components/SpendingBreakdownChart'
import {
  getTotalBalance,
  getTotalIncome,
  getTotalExpenses,
  getMonthlyTrend,
  getSpendingByCategory,
  formatCurrency,
} from '../utils/finance'

export function DashboardPage() {
  const transactions = useStore((s) => s.transactions)

  const balance = getTotalBalance(transactions)
  const income = getTotalIncome(transactions)
  const expenses = getTotalExpenses(transactions)
  const monthlyTrend = getMonthlyTrend(transactions)
  const spendingByCategory = getSpendingByCategory(transactions)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Total Balance"
          value={formatCurrency(balance)}
          colorClass={balance >= 0 ? 'text-gray-900' : 'text-red-600'}
        />
        <SummaryCard
          label="Total Income"
          value={formatCurrency(income)}
          colorClass="text-emerald-600"
          trend="up"
        />
        <SummaryCard
          label="Total Expenses"
          value={formatCurrency(expenses)}
          colorClass="text-red-600"
          trend="down"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Balance Trend</h2>
          <BalanceTrendChart data={monthlyTrend} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Spending by Category</h2>
          <SpendingBreakdownChart data={spendingByCategory} />
        </div>
      </div>
    </div>
  )
}
