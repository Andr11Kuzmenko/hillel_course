import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import App from './App.jsx'
import { MarketProvider } from './context/MarketContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MarketProvider>
        <App />
      </MarketProvider>
    </BrowserRouter>
  </StrictMode>,
)
