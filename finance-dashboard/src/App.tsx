import { useEffect } from 'react'
import { useStore } from './store/useStore'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { InsightsPage } from './pages/InsightsPage'

function App() {
  const activePage = useStore((s) => s.activePage)
  const darkMode   = useStore((s) => s.darkMode)
  const loading    = useStore((s) => s.loading)
  const bootstrap  = useStore((s) => s._bootstrap)

  // Sync dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Bootstrap: fetch from mock API on first load (skips if persisted data exists)
  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <span className="text-sm">Loading transactions…</span>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      {activePage === 'dashboard' && <DashboardPage />}
      {activePage === 'transactions' && <TransactionsPage />}
      {activePage === 'insights' && <InsightsPage />}
    </Layout>
  )
}

export default App
