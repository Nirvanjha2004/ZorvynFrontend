import { useStore } from '../store/useStore'
import { RoleSelector } from './RoleSelector'
import type { ActivePage } from '../types'

const navItems: { page: ActivePage; label: string; icon: string }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: '📊' },
  { page: 'transactions', label: 'Transactions', icon: '💳' },
  { page: 'insights', label: 'Insights', icon: '💡' },
]

export function Sidebar() {
  const activePage = useStore((s) => s.activePage)
  const setActivePage = useStore((s) => s.setActivePage)

  return (
    <aside className="flex flex-col gap-6 p-4 h-full">
      <div className="text-lg font-bold text-indigo-600 tracking-tight px-2">
        💰 FinanceApp
      </div>

      <nav aria-label="Main navigation">
        <ul className="flex flex-col gap-1">
          {navItems.map(({ page, label, icon }) => (
            <li key={page}>
              <button
                onClick={() => setActivePage(page)}
                aria-current={activePage === page ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activePage === page
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span aria-hidden="true">{icon}</span>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto px-2">
        <RoleSelector />
      </div>
    </aside>
  )
}
