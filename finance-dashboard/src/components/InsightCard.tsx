interface InsightCardProps {
  icon: string
  label: string
  value: string
  subtext?: string
}

export function InsightCard({ icon, label, value, subtext }: InsightCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-start gap-4">
      <span className="text-3xl" aria-hidden="true">{icon}</span>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="text-xl font-bold text-gray-900">{value}</span>
        {subtext && <span className="text-xs text-gray-400">{subtext}</span>}
      </div>
    </div>
  )
}
