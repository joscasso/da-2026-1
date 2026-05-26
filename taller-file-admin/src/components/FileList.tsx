import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient'
import  Uploader  from './Uploader'

const FileList = ({ userId, bucketName}) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Define la función para obtener los archivos
  const fetchFiles = useCallback(async () => {
    if (!userId) {
      setError('Error: El ID de usuario no está disponible.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // El 'path' dentro del bucket es típicamente el userId pero para este ejemplo será la raíz 
    const folderPath = ''; 

    try {
      // 1. Llamar a la API de listado
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list(folderPath, {
          limit: 100, // Límite de archivos a obtener
          sortBy: { column: 'created_at', order: 'desc' }, // Ordenar por fecha
        });

      if (error) {
        throw error;
      }

      // 2. Filtrar o limpiar datos
      // Supabase a veces retorna un archivo raíz vacío, lo filtramos.
      const cleanedData = data.filter(file => file.name !== '.emptyFolderPlaceholder');
      
      setFiles(cleanedData);
      
    } catch (err) {
      console.error('Error al listar archivos:', err);
      setError(`No se pudieron cargar los archivos: ${err.message || err.toString()}`);
    } finally {
      setIsLoading(false);
    }
  }, [userId, bucketName]);

  // Ejecutar la carga de archivos al montar y cuando cambie el userId
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Función para manejar la eliminación
  const handleDelete = async (fileName: string) => {
    // Usamos el path completo que usó el uploader: 'userId/fileName'
    //const fullPath = `${userId}/${fileName}`; 
    const fullPath = fileName; 
    
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el archivo "${fileName}"?`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      // 1. Llamar a la API de eliminación (necesita un array de paths)
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([fullPath]);

      if (error) {
        throw error;
      }

      // 2. Recargar la lista para reflejar el cambio
      await fetchFiles();

    } catch (err) {
      console.error('Error al eliminar archivo:', err);
      setError(`Error al eliminar: ${err.message || err.toString()}`);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Función de utilidad para generar la URL pública
  const getDownloadUrl = (fileName: string) => {
    // La URL pública sigue la estructura: [URL_BASE]/storage/v1/object/public/[bucketName]/[userId]/[fileName]
    const fullPath = fileName;
    const { data } = supabase.storage.from(bucketName).getPublicUrl(fullPath);
    return data.publicUrl;
  };

  if (error) {
    return (
      <div className="p-6 mt-6 bg-red-100 border border-red-400 text-red-700 rounded-xl">
        <h3 className="font-bold mb-2">Error de Conexión</h3>
        <p>{error}</p>
        <button onClick={fetchFiles} className="mt-2 text-sm text-red-500 hover:underline">Reintentar Carga</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 mt-6 bg-white shadow-xl rounded-xl text-center">
        <svg className="animate-spin h-5 w-5 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-2 text-indigo-600">Cargando lista de archivos...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 text-indigo-500">
      <Uploader userId={userId} onUploadSuccess={fetchFiles} bucketName='demo-files'></Uploader>

      <h3 className="text-xl font-bold mb-4 flex justify-between items-center text-indigo-700">
        Archivos en Bucket: <span className="text-base font-normal text-gray-500">{bucketName}</span>
        <button 
          onClick={fetchFiles} 
          disabled={isDeleting}
          className="ml-4 p-2 bg-indigo-100 text-indigo-600 hover:bg-indigo-200 rounded-full transition duration-150"
          title="Refrescar Lista"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 12m2.004 1.5l.044-.012m2.413 5.466l.044-.012M18 9v5h.582m1.026 4.414L20 19m-2-2l.044-.012M20 12a8.001 8.001 0 00-15.356-2L5.5 10m15.026 4.414L20 15m-2 2l.044-.012"></path></svg>
        </button>
      </h3>
      
      {files.length === 0 ? (
        <div className="p-10 bg-gray-50 text-center text-gray-500 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-lg font-medium">Aún no hay archivos subidos.</p>
          <p className="text-sm mt-1">Sube el primer archivo usando el componente de arriba.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {files.map((file) => (
            <li key={file.name} className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-indigo-50 transition duration-150 rounded-lg">
              <div className="flex-1 min-w-0 mr-4">
                <p className="text-sm font-semibold text-gray-900 truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatBytes(file.metadata.size)} | Subido: {new Date(file.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex space-x-2">
                {/* Botón de Descarga/Visualización */}
                <a 
                  href={getDownloadUrl(file.name)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-full transition duration-150"
                  title="Descargar/Ver Archivo"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </a>
                
                {/* Botón de Eliminación */}
                <button
                  onClick={() => handleDelete(file.name)}
                  disabled={isDeleting}
                  className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-full transition duration-150 disabled:opacity-50"
                  title="Eliminar Archivo"
                >
                  {isDeleting ? (
                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Componente de Utilidad para formatear el tamaño del archivo
const formatBytes = (bytes = 0, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default FileList;
