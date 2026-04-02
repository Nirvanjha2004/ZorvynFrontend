import { useToastStore } from '../hooks/useToast'

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-up border min-w-64 ${
            t.type === 'success'
              ? 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-100'
              : 'bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-800 text-red-700 dark:text-red-300'
          }`}
        >
          <span className="text-base flex-shrink-0" aria-hidden="true">
            {t.type === 'success' ? '✓' : '✕'}
          </span>
          <span className="flex-1">{t.message}</span>
          {t.onUndo && (
            <button
              onClick={() => { t.onUndo?.(); removeToast(t.id) }}
              className="flex-shrink-0 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors px-1"
            >
              Undo
            </button>
          )}
          <button
            onClick={() => removeToast(t.id)}
            aria-label="Dismiss"
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
