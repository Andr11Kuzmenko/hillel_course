import { AppProvider } from './context/AppContext.jsx'
import Layout from './components/Layout.jsx'

// App лише обгортає дерево провайдером — жодних props вниз не передається
export default function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  )
}
