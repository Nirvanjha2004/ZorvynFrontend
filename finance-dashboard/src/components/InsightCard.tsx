interface InsightCardProps {
  icon: string
  label: string
  value: string
  subtext?: string
  accent?: 'indigo' | 'emerald' | 'amber' | 'red'
}

const accentMap = {
  indigo:  'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  amber:   'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
  red:     'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400',
}

export function InsightCard({ icon, label, value, subtext, accent = 'indigo' }: InsightCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/60 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl mb-4 ${accentMap[accent]}`}>
        {icon}
      </div>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
      {subtext && <p className="text-xs text-gray-400 dark:text-gray-500">{subtext}</p>}
    </div>
  )
}
