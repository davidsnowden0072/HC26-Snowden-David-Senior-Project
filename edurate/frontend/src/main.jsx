/**
 * main.jsx
 * 
 * Application entry point that renders the React app into the DOM.
 * Wraps the root App component in React.StrictMode for development warnings
 * and imports global styles from index.css (includes Tailwind directives).
 * 
 * This file is called by Vite to bootstrap the application.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'  

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
