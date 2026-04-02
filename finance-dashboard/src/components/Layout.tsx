import { useState, type ReactNode } from 'react'
import { useStore } from '../store/useStore'
import { Sidebar } from './Sidebar'
import { ToastContainer } from './ToastContainer'
import type { ActivePage } from '../types'

const navItems: { page: ActivePage; label: string }[] = [
  { page: 'dashboard', label: 'Dashboard' },
  { page: 'transactions', label: 'Transactions' },
  { page: 'insights', label: 'Insights' },
]

export function Layout({ children }: { children: ReactNode }) {
  const activePage    = useStore((s) => s.activePage)
  const setActivePage = useStore((s) => s.setActivePage)
  const darkMode      = useStore((s) => s.darkMode)
  const toggleDarkMode= useStore((s) => s.toggleDarkMode)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex transition-colors duration-200">
      {/* ── Desktop sidebar ── */}
      <div className="hidden lg:flex lg:w-60 lg:flex-shrink-0 lg:fixed lg:inset-y-0">
        <Sidebar />
      </div>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 lg:hidden transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col lg:pl-60">
        {/* Top navbar */}
        <header className="sticky top-0 z-20 bg-white/60 dark:bg-gray-950/70 backdrop-blur-lg border-b border-gray-200/60 dark:border-gray-800/60 shadow-sm px-4 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Left: hamburger + page title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Open menu"
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>

            {/* Mobile nav pills */}
            <nav className="lg:hidden flex gap-1" aria-label="Mobile navigation">
              {navItems.map(({ page, label }) => (
                <button
                  key={page}
                  onClick={() => { setActivePage(page); setMobileOpen(false) }}
                  aria-current={activePage === page ? 'page' : undefined}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    activePage === page
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* Desktop page title */}
            <h1 className="hidden lg:block text-sm font-semibold text-gray-900 dark:text-white capitalize">
              {activePage}
            </h1>
          </div>

          {/* Right: dark mode + avatar */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 lg:px-8 py-6">
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}
