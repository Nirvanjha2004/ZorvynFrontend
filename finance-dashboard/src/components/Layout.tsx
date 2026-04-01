import type { ReactNode } from 'react'
import { useStore } from '../store/useStore'
import { Sidebar } from './Sidebar'
import type { ActivePage } from '../types'

const navItems: { page: ActivePage; label: string }[] = [
  { page: 'dashboard', label: 'Dashboard' },
  { page: 'transactions', label: 'Transactions' },
  { page: 'insights', label: 'Insights' },
]

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const activePage = useStore((s) => s.activePage)
  const setActivePage = useStore((s) => s.setActivePage)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-56 md:flex-shrink-0 bg-white border-r border-gray-200 min-h-screen">
        <Sidebar />
      </div>

      {/* Mobile top nav */}
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <span className="text-base font-bold text-indigo-600">💰 FinanceApp</span>
        <nav aria-label="Mobile navigation">
          <ul className="flex gap-1">
            {navItems.map(({ page, label }) => (
              <li key={page}>
                <button
                  onClick={() => setActivePage(page)}
                  aria-current={activePage === page ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activePage === page
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}
