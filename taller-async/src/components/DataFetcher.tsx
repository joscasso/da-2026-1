import { useState, useEffect } from 'react';

// 1. Definición del tipo de dato con TypeScript
type Post = { id: number; title: string; body: string; };

const DataFetcher = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Usamos useEffect para el side effect de la petición
  useEffect(() => {
    // Definimos la función asíncrona DENTRO de useEffect
    const fetchPosts = async () => {
      setLoading(true); // Iniciamos el estado de carga
      setError(null);
      try {
        // Petición de Request usando fetch y await (manejo de Promesa)
        const response = await fetch('https://jsonplaceholder.typicode.com1/posts?_limit=5'); 

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data: Post[] = await response.json(); // Convertir a JSON (otra Promesa)
        setPosts(data); // Actualizamos el estado con los datos
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar.');
      } finally {
        setLoading(false); // Finalizamos el estado de carga
      }
    };

    fetchPosts(); // Ejecutamos la función
  }, []); // El array vacío [] asegura que se ejecute SOLO al montar

  // 3. Renderizado condicional
  if (loading) return <p>Cargando posts de la API...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h3>Últimos Posts Asíncronos</h3>
      <ul>
        {posts.map(post => (
          <li key={post.id}><strong>{post.title + "--" + post.body }</strong></li>
        ))}
      </ul>
    </div>
  );
};

export default DataFetcher;
