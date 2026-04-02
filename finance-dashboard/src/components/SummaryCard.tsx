interface SummaryCardProps {
  label: string
  value: string
  trend?: { direction: 'up' | 'down' | 'same'; label: string }
  icon: React.ReactNode
  accent: 'indigo' | 'emerald' | 'red'
  context?: string
}

const accentMap = {
  indigo:  { icon: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400', value: 'text-gray-900 dark:text-white' },
  emerald: { icon: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', value: 'text-emerald-700 dark:text-emerald-400' },
  red:     { icon: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400', value: 'text-red-700 dark:text-red-400' },
}

export function SummaryCard({ label, value, trend, icon, accent, context }: SummaryCardProps) {
  const colors = accentMap[accent]
  const trendUp   = trend?.direction === 'up'
  const trendDown = trend?.direction === 'down'

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/60 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.icon}`}>
          {icon}
        </div>
        {trend && trend.direction !== 'same' && (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            trendUp   ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400' :
            trendDown ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : ''
          }`}>
            {trendUp ? '↑' : '↓'} {trend.label}
          </span>
        )}
      </div>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold tracking-tight ${colors.value}`}>{value}</p>
      {context && (
        <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-1.5">{context}</p>
      )}
    </div>
  )
}
