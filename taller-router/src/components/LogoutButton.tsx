// 1. Importar useNavigate
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  // 2. Ejecutar el hook para obtener la función navigate
  const navigate = useNavigate();

  function handleLogout() {
    // Lógica de simulación para cerrar sesión 
    alert('Usuario ha cerrado sesión. Redirigiendo...');
    
    // 3. Navegación programática: Redirigir al usuario a la página de inicio ('/')
    navigate('/contact', { 
      replace: true // Reemplaza la entrada actual en el historial
    }); 
  }

  return (
    <button onClick={handleLogout} style={{ 
      marginTop: '10px', 
      padding: '10px', 
      backgroundColor: 'tomato', 
      color: 'white', 
      border: 'none', 
      cursor: 'pointer' 
    }}>
      Cerrar Sesión (useNavigate)
    </button>
  );
}

export default LogoutButton;

