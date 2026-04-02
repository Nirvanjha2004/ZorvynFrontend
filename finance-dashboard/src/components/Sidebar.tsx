import { useStore } from '../store/useStore'
import { Select } from './Select'
import type { ActivePage } from '../types'
import type { SelectOption } from './Select'

const roleOptions: SelectOption[] = [
  { value: 'admin',  label: 'Admin',  icon: '🔑', description: 'Can add & edit' },
  { value: 'viewer', label: 'Viewer', icon: '👁️', description: 'Read only' },
]

/* ── Inline SVG icons (no extra dep) ── */
const Icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  transactions: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 7h20M2 12h20M2 17h20"/>
    </svg>
  ),
  insights: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  sun: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  moon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
}

const navItems: { page: ActivePage; label: string; icon: keyof typeof Icons }[] = [
  { page: 'dashboard',    label: 'Dashboard',    icon: 'dashboard' },
  { page: 'transactions', label: 'Transactions', icon: 'transactions' },
  { page: 'insights',     label: 'Insights',     icon: 'insights' },
]

export function Sidebar() {
  const activePage    = useStore((s) => s.activePage)
  const setActivePage = useStore((s) => s.setActivePage)
  const role          = useStore((s) => s.role)
  const setRole       = useStore((s) => s.setRole)
  const darkMode      = useStore((s) => s.darkMode)
  const toggleDarkMode= useStore((s) => s.toggleDarkMode)

  return (
    <aside className="flex flex-col w-full h-full bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800/60">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">FinanceOS</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4" aria-label="Main navigation">
        <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest px-3 mb-2">Menu</p>
        <ul className="flex flex-col gap-0.5">
          {navItems.map(({ page, label, icon }) => {
            const active = activePage === page
            return (
              <li key={page}>
                <button
                  onClick={() => setActivePage(page)}
                  aria-current={active ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                    active
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <span className={`transition-colors ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}>
                    {Icons[icon]}
                  </span>
                  {label}
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom controls */}
      <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800/60 flex flex-col gap-3">
        {/* Role selector */}
        <div className="px-3">
          <Select
            label="Role"
            value={role}
            onChange={(v) => setRole(v as 'admin' | 'viewer')}
            options={roleOptions}
          />
        </div>

        {/* Dark mode */}
        <button
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          className="mx-3 flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200 transition-all"
        >
          <span>{darkMode ? Icons.sun : Icons.moon}</span>
          {darkMode ? 'Light mode' : 'Dark mode'}
        </button>

        {/* Avatar */}
        <div className="mx-3 flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/60">
          <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
            A
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">Admin User</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate capitalize">{role}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
