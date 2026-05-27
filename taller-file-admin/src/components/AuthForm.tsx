// src/components/AuthForm.tsx
import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AuthForm({ onSignIn }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (isSignUp: boolean) => {
    setLoading(true);
    let error = null;

    if (isSignUp) {
      // Registrar nuevo usuario (Sign Up)
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      error = signUpError;
    } else {
      // Iniciar sesión (Sign In)
      const { data: session, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      error = signInError;

      onSignIn(session);
    }

    if (error) {
      console.error(error.message);
      // Usar alerta temporal ya que no hay componente de modal en esta presentación.
      alert(isSignUp ? 'Error al registrarse.' : 'Error al iniciar sesión.'); 
    } else {
      alert(isSignUp ? '¡Revisa tu correo para confirmar!' : '¡Sesión iniciada con éxito!');
    }
    setLoading(false);
   
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 text-indigo-500">
      <h3 className="text-xl font-bold mb-4 flex justify-between items-center text-indigo-700">Autenticación de Usuario</h3>  
      <form onSubmit={(e) => e.preventDefault()} style={{ gap: '15px' }}>
        <input style={{ margin: '10px' }}
          type="email"
          placeholder="Tu Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input style={{ margin: '10px' }}
          type="password"
          placeholder="Tu Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button style={{ margin: '5px' }}
          onClick={() => handleAuth(false)}
          disabled={loading || !email || !password}
          className="py-2 px-4 bg-indigo-400 text-white font-semibold rounded-lg hover:bg-indigo-600 cursor-pointer transition duration-200"
        >
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
        <button
          onClick={() => handleAuth(true)}
          disabled={loading || !email || !password}
          className="py-2 px-4rounded-lg cursor-pointer transition duration-200"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
