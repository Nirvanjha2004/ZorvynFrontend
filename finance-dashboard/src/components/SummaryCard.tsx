interface SummaryCardProps {
  label: string
  value: string
  trend?: 'up' | 'down' | 'neutral'
  colorClass?: string
}

export function SummaryCard({ label, value, trend, colorClass = 'text-gray-900' }: SummaryCardProps) {
  const trendIcon = trend === 'up' ? '▲' : trend === 'down' ? '▼' : null
  const trendColor = trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : ''

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-2 shadow-sm">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      <div className="flex items-end gap-2">
        <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
        {trendIcon && (
          <span className={`text-sm font-medium mb-0.5 ${trendColor}`} aria-label={trend}>
            {trendIcon}
          </span>
        )}
      </div>
    </div>
  )
}
