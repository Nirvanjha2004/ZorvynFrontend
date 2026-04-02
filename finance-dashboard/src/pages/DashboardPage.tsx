import { useStore } from '../store/useStore'
import { SummaryCard } from '../components/SummaryCard'
import { BalanceTrendChart } from '../components/BalanceTrendChart'
import { SpendingBreakdownChart } from '../components/SpendingBreakdownChart'
import {
  getTotalBalance, getTotalIncome, getTotalExpenses,
  getMonthlyTrend, getSpendingByCategory, getMonthOverMonthChange,
  formatCurrency,
} from '../utils/finance'

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/>
    <circle cx="18" cy="12" r="2"/>
  </svg>
)
const ArrowUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
  </svg>
)
const ArrowDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
  </svg>
)

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/60 p-6 shadow-sm h-full">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function CardSkeleton() {
  return <div className="skeleton h-28 rounded-2xl" />
}

function ChartSkeleton() {
  return <div className="skeleton h-72 rounded-2xl" />
}

export function DashboardPage() {
  const transactions = useStore((s) => s.transactions)
  const loading      = useStore((s) => s.loading)

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className="skeleton h-8 w-48 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3"><ChartSkeleton /></div>
          <div className="lg:col-span-2"><ChartSkeleton /></div>
        </div>
      </div>
    )
  }

  const balance    = getTotalBalance(transactions)
  const income     = getTotalIncome(transactions)
  const expenses   = getTotalExpenses(transactions)
  const trend      = getMonthlyTrend(transactions)
  const byCategory = getSpendingByCategory(transactions)
  const mom        = getMonthOverMonthChange(transactions)

  // Expense MoM — only shown on the Expenses card
  const expenseMomPct = mom.previous > 0
    ? Math.abs(((mom.current - mom.previous) / mom.previous) * 100).toFixed(1) + '%'
    : null

  // Date range context
  const dates = transactions.map((t) => t.date).sort()
  const rangeLabel = dates.length >= 2
    ? `${dates[0].slice(0, 7)} – ${dates[dates.length - 1].slice(0, 7)}`
    : 'All time'

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Your financial summary at a glance</p>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
          {rangeLabel}
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Total Balance"
          value={formatCurrency(balance)}
          icon={<WalletIcon />}
          accent="indigo"
          context="Net of all income minus expenses"
        />
        <SummaryCard
          label="Total Income"
          value={formatCurrency(income)}
          icon={<ArrowUpIcon />}
          accent="emerald"
          context="All income transactions"
        />
        <SummaryCard
          label="Total Expenses"
          value={formatCurrency(expenses)}
          icon={<ArrowDownIcon />}
          accent="red"
          context="All expense transactions"
          trend={expenseMomPct ? { direction: mom.direction, label: expenseMomPct + ' vs last month' } : undefined}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <ChartCard title="Balance Trend" subtitle="Monthly income vs expenses">
            <BalanceTrendChart data={trend} />
          </ChartCard>
        </div>
        <div className="lg:col-span-2">
          <ChartCard title="Spending Breakdown" subtitle="By category — expenses only">
            <SpendingBreakdownChart data={byCategory} />
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
