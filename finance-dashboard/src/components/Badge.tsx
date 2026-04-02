import type { Category, TransactionType } from '../types'

const categoryStyle: Record<string, string> = {
  Salary:        'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  Food:          'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400',
  Rent:          'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400',
  Entertainment: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400',
  Transport:     'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',
  Healthcare:    'bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400',
  Shopping:      'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  Utilities:     'bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400',
  Other:         'bg-gray-100 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400',
}

const categoryIcon: Record<string, string> = {
  Salary: '💼', Food: '🍔', Rent: '🏠', Entertainment: '🎬',
  Transport: '🚗', Healthcare: '💊', Shopping: '🛍️', Utilities: '⚡', Other: '📦',
}

interface BadgeProps {
  label: Category | TransactionType | string
  variant?: 'category' | 'type'
  showIcon?: boolean
}

export function Badge({ label, variant = 'category', showIcon = false }: BadgeProps) {
  const typeStyle = label === 'income'
    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
    : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400'

  const colorClass = variant === 'type' ? typeStyle : (categoryStyle[label] ?? 'bg-gray-100 text-gray-600')
  const icon = showIcon && variant === 'category' ? categoryIcon[label] : null

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${colorClass}`}>
      {icon && <span className="text-[10px]">{icon}</span>}
      {label}
    </span>
  )
}
