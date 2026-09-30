import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// StrictMode не використовується навмисно: у dev-режимі він рендерить компоненти двічі,
// що спотворювало б лічильники рендерів у демонстрації.
createRoot(document.getElementById('root')).render(<App />)
