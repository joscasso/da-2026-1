import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NavBar from './components/NavBar';
import DashboardLayout from './pages/DashboardLayout'; // Para el Paso 4

// Declaración de función para el componente principal
function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        {/* Ruta raíz */}
        <Route path="/" element={<Home />} /> 
        {/* Otras rutas */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Ruta Padre para anidamiento (Paso 4) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<h3>Bienvenido al Resumen del Dashboard</h3>} /> 
          <Route path="profile" element={<h3>Página de Perfil del Usuario</h3>} /> 
          <Route path="settings" element={<h3>Ajustes de la Aplicación</h3>} /> 
        </Route>

        {/* Ruta para "No encontrado" (404) */}
        <Route path="*" element={<h1>404: Página no encontrada</h1>} /> 
      </Routes>
    </div>
  );
}

export default App;
