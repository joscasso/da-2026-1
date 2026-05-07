import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// 1. Importar el Provider de react-redux
import { Provider } from 'react-redux';
// 2. Importar el Store configurado
import { store } from './store'; // Asegúrate que esta ruta es correcta
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)