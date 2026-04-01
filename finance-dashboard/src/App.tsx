import { useStore } from './store/useStore'
import { Layout } from './components/Layout'

// Pages will be imported as they are built
// Using lazy placeholders until pages exist
function PlaceholderPage({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
      {name} page coming soon…
    </div>
  )
}

function App() {
  const activePage = useStore((s) => s.activePage)

  return (
    <Layout>
      {activePage === 'dashboard' && <PlaceholderPage name="Dashboard" />}
      {activePage === 'transactions' && <PlaceholderPage name="Transactions" />}
      {activePage === 'insights' && <PlaceholderPage name="Insights" />}
    </Layout>
  )
}

export default App
