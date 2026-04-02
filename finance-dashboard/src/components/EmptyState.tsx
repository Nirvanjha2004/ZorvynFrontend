interface EmptyStateProps {
  message: string
  icon?: string
}

export function EmptyState({ message, icon = '📭' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-600">
      <span className="text-4xl mb-3" aria-hidden="true">{icon}</span>
      <p className="text-sm">{message}</p>
    </div>
  )
}
