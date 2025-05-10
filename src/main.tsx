
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create root with proper React context
const root = ReactDOM.createRoot(document.getElementById('root')!)

// Wrap App with React.StrictMode to ensure proper context for hooks
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
