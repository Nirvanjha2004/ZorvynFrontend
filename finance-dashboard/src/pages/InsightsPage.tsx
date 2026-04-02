import { useStore } from '../store/useStore'
import { InsightCard } from '../components/InsightCard'
import {
  getHighestSpendingCategory, getMonthOverMonthChange,
  getAverageMonthlyExpense, getTotalIncome, getTotalExpenses,
  getSpendingByCategory, formatCurrency,
} from '../utils/finance'

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f97316']

// SVG icons — consistent with sidebar/navbar icon style
const TrophyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
)
const TrendUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
  </svg>
)
const TrendDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>
  </svg>
)
const TrendFlatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const PiggyBankIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2z"/>
    <path d="M2 9v1a2 2 0 0 0 2 2h1"/><path d="M16 11h0"/>
  </svg>
)

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
  const savingsRateNum = income > 0 ? ((income - expenses) / income) * 100 : 0
  const savingsRate = savingsRateNum.toFixed(1)
  const isNegativeSavings = savingsRateNum < 0
  const savingsSubtext = isNegativeSavings
    ? `Spending ${formatCurrency(expenses - income)} more than earned`
    : `${formatCurrency(income - expenses)} saved of ${formatCurrency(income)} earned`

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
          icon={<TrophyIcon />}
          label="Top Spending Category"
          value={topCategory ? topCategory.category : '—'}
          subtext={topCategory ? `${formatCurrency(topCategory.total)} total spent` : undefined}
          accent="amber"
        />
        <InsightCard
          icon={mom.direction === 'up' ? <TrendUpIcon /> : mom.direction === 'down' ? <TrendDownIcon /> : <TrendFlatIcon />}
          label="This Month's Expenses"
          value={formatCurrency(mom.current)}
          subtext={momSubtext}
          accent={mom.direction === 'up' ? 'red' : 'emerald'}
        />
        <InsightCard
          icon={<CalendarIcon />}
          label="Avg Monthly Expense"
          value={formatCurrency(avgMonthly)}
          subtext="across all recorded months"
          accent="indigo"
        />
        <InsightCard
          icon={<PiggyBankIcon />}
          label="Savings Rate"
          value={isNegativeSavings ? `−${Math.abs(savingsRateNum).toFixed(1)}%` : `${savingsRate}%`}
          subtext={savingsSubtext}
          accent={savingsRateNum >= 20 ? 'emerald' : savingsRateNum >= 10 ? 'amber' : 'red'}
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
