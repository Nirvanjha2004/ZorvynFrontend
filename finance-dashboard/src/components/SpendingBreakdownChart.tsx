import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { CategoryDataPoint } from '../types'
import { EmptyState } from './EmptyState'

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f97316']

interface Props { data: CategoryDataPoint[] }

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-gray-700 dark:text-gray-300">{name}</p>
      <p className="text-gray-500 dark:text-gray-400 mt-1">
        ${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </p>
    </div>
  )
}

export function SpendingBreakdownChart({ data }: Props) {
  if (data.length === 0) return <EmptyState message="No spending data yet" icon="🍩" />

  const total = data.reduce((s, d) => s + d.total, 0)
  const totalLabel = total >= 1000 ? `$${(total / 1000).toFixed(1)}k` : `$${total.toFixed(0)}`

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={82}
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-none">Total</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white mt-0.5 tabular-nums">{totalLabel}</span>
        </div>
      </div>

      {/* Legend with mini progress bars */}
      <div className="flex flex-col gap-2">
        {data.slice(0, 5).map((d, i) => (
          <div key={d.category} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="text-gray-600 dark:text-gray-400 w-24 truncate flex-shrink-0">{d.category}</span>
            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${(d.total / total) * 100}%`, background: COLORS[i % COLORS.length] }}
              />
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300 w-8 text-right tabular-nums">
              {((d.total / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
        {data.length > 5 && (
          <p className="text-xs text-gray-400 dark:text-gray-600 pl-4">+{data.length - 5} more</p>
        )}
      </div>
    </div>
  )
}
