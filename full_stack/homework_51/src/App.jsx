import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import CoinPage from './pages/CoinPage.jsx'
import PortfolioPage from './pages/PortfolioPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="coin/:id" element={<CoinPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
