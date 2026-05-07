
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// 1. Importar BrowserRouter
import { BrowserRouter } from 'react-router-dom';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 2. Envolver la App en BrowserRouter */}
    <BrowserRouter>
       <App />
    </BrowserRouter>
  </StrictMode>,
)
