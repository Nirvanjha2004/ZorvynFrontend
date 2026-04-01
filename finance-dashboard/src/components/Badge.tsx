import type { Category, TransactionType } from '../types'

const categoryColors: Record<string, string> = {
  Salary: 'bg-green-100 text-green-800',
  Food: 'bg-orange-100 text-orange-800',
  Rent: 'bg-red-100 text-red-800',
  Entertainment: 'bg-purple-100 text-purple-800',
  Transport: 'bg-blue-100 text-blue-800',
  Healthcare: 'bg-pink-100 text-pink-800',
  Shopping: 'bg-yellow-100 text-yellow-800',
  Utilities: 'bg-gray-100 text-gray-700',
  Other: 'bg-slate-100 text-slate-700',
}

interface BadgeProps {
  label: Category | TransactionType | string
  variant?: 'category' | 'type'
}

export function Badge({ label, variant = 'category' }: BadgeProps) {
  const typeColor =
    label === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
  const colorClass =
    variant === 'type' ? typeColor : (categoryColors[label] ?? 'bg-gray-100 text-gray-700')

  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  )
}
