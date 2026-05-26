import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import  AuthForm  from './components/AuthForm'
import  FileList  from './components/FileList'
import './App.css'

// --- Componentes Reutilizables y Utilitarios ---
// Componente para el ícono de carga
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span className="text-lg text-slate-700">Cargando sesión...</span>
  </div>
);

// Panel de Control (Dashboard)
const Dashboard = ({ user, onSignOut }) => {
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <header className="flex justify-between items-center p-4 bg-white rounded-xl shadow-lg mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">
          <i className="fas fa-cubes mr-2"></i> Administrador de Archivos
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-lg font-medium text-slate-700">
            {user.email}
          </span>
          <button style={{ margin: '5px' }}
            onClick={onSignOut}
            className="py-2 px-4 bg-red-400 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
          >
            Cerrar Sesión
          </button>        
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 text-indigo-500">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">¡Bienvenido!</h2>
          <p className="text-slate-600">Has iniciado sesión con éxito. Este es el contenido protegido de tu aplicación.</p>
          <div className="mt-4 p-4 bg-teal-50 rounded-lg text-sm text-teal-800">
            <span><strong>ID de Usuario:</strong> {user.id}</span>
          </div>
        </div>
        <FileList userId={user.id} bucketName='demo-files'></FileList>
      </div>
    </div>
  );
};

// --- Componente Principal ---
export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Chequeo de autenticación al inicio
  useEffect(() => {
    
    const checkAuth = async () => {
      // Obtener la sesión o el token del localStorage/Cookies.
      const storedUser = JSON.parse(localStorage.getItem('user_session'));
      
      if (storedUser) {
        setUser(storedUser.user);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Función para el inicio de sesión
  const handleSignIn = (userData) => {
    localStorage.setItem('user_session', JSON.stringify(userData));
    setUser(userData.user);
  };

  // Función parael cierre de sesión
  async function handleSignOut  ()  {

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error al cerrar sesión:', error.message);
      alert('Ocurrió un error al intentar cerrar la sesión.');
    } else {
      console.log('Sesión cerrada exitosamente.');
      alert('¡Has cerrado sesión!');
      // Aquí puedes redirigir al usuario a la página de inicio de sesión o actualizar la UI.
    }
  
    localStorage.removeItem('user_session');
    setUser(null);
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <LoadingSpinner />
        </div>
    );
  }

  // Lógica principal de autenticación: Si el usuario es null, mostrar SignIn.
  return (
    <div className="font-sans">
      {user ? (
        <Dashboard user={user} onSignOut={handleSignOut} />
      ) : (
        <AuthForm onSignIn={handleSignIn} />
      )}
    </div>
  );
}
