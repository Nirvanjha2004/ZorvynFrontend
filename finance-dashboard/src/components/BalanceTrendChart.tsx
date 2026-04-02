import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import type { MonthlyDataPoint } from '../types'
import { EmptyState } from './EmptyState'

interface Props { data: MonthlyDataPoint[] }

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-500 dark:text-gray-400 capitalize">{p.name}:</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(Number(p.value))}
          </span>
        </div>
      ))}
    </div>
  )
}

export function BalanceTrendChart({ data }: Props) {
  if (data.length === 0) return <EmptyState message="No trend data yet" icon="📈" />

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.12}/>
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="gradBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
        <Area type="monotone" dataKey="income"   stroke="#10b981" strokeWidth={2} fill="url(#gradIncome)"   name="Income"   dot={false} activeDot={{ r: 4 }} />
        <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="url(#gradExpenses)" name="Expenses" dot={false} activeDot={{ r: 4 }} />
        <Area type="monotone" dataKey="balance"  stroke="#6366f1" strokeWidth={2} fill="url(#gradBalance)"  name="Balance"  dot={false} activeDot={{ r: 4 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
