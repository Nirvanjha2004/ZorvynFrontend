import { useStore } from './store/useStore'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { InsightsPage } from './pages/InsightsPage'

function App() {
  const activePage = useStore((s) => s.activePage)

  return (
    <Layout>
      {activePage === 'dashboard' && <DashboardPage />}
      {activePage === 'transactions' && <TransactionsPage />}
      {activePage === 'insights' && <InsightsPage />}
    </Layout>
  )
}

export default App
