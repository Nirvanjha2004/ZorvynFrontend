import { useEffect } from 'react'
import { useStore } from './store/useStore'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { InsightsPage } from './pages/InsightsPage'
import { mockApi } from './api/mockApi'

function App() {
  const activePage = useStore((s) => s.activePage)
  const darkMode = useStore((s) => s.darkMode)
  const transactions = useStore((s) => s.transactions)
  const setTransactions = useStore((s) => s.setTransactions)
  const setLoading = useStore((s) => s.setLoading)
  const loading = useStore((s) => s.loading)

  // Sync dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Fetch from mock API on first load (if no persisted data)
  useEffect(() => {
    if (transactions.length > 0) {
      setLoading(false)
      return
    }
    mockApi.fetchTransactions().then((data) => {
      setTransactions(data)
      setLoading(false)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
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
