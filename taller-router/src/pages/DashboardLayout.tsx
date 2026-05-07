import { Outlet, Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton'; // Para el Paso 5

function DashboardLayout() {
  return (
    <div style={{ border: '2px solid red', padding: '15px' }}>
      <h2>Panel de Control (Layout Principal)</h2>
      <nav>
        {/* Links relativos: "" navega a /dashboard; "profile" navega a /dashboard/profile */}
        <Link to="">Resumen</Link> |{' '} 
        <Link to="profile">Mi Perfil</Link> |{' '}
        <Link to="settings">Configuración</Link> 
      </nav>
      <hr />
      {/* Outlet: El contenido de la ruta hija se renderiza aquí */}
      <Outlet /> 
      
      {/* Componente para demostrar useNavigate (Paso 5) */}
      <LogoutButton />
    </div>
  );
}

export default DashboardLayout;

