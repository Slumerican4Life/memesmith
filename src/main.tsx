
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create root without StrictMode to avoid potential double renders
const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(<App />)
