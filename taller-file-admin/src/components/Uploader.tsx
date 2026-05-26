import { useState } from 'react';
import { supabase } from '../supabaseClient'

const Uploader = ({userId, onUploadSuccess, bucketName }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Error: Selecciona un archivo y asegúrate de estar autenticado.');
      return;
    }

    setIsUploading(true);
    setMessage('Iniciando carga...');

    // 1. Construir el Path Seguro
    // La ruta normalmente incluye el userId para garantizar que solo el dueño del archivo pueda acceder
    // Pero para este ejemplo no se tuvo en cuenta

    // Reemplaza todos los espacios en blanco por guión bajo
    const filePath = `${file.name.replace(/\s/g, '_')}`;
    
    // 2. Ejecutar la Carga a Supabase Storage
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false, // Evita sobrescribir
          contentType: file.type || 'application/octet-stream', // Establece el tipo MIME
        });

      if (error) {
        throw error;
      }

      setMessage(`✅ Archivo '${file.name}' subido con éxito!`);
      setFile(null); // Limpiar el input después de la subida
      
      // Notificar al componente padre que la lista debe refrescarse
      onUploadSuccess(); 

    } catch (error) {
      console.error('Error al subir el archivo:', error);
      setMessage(`❌ Error de subida: ${error.message}. Revisa tus políticas RLS.`);
    } finally {
      setIsUploading(false);
    }
  };

  const buttonClass = isUploading || !file
    ? 'bg-gray-400 cursor-not-allowed'
    : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800';

  return (
    <div className="bg-white pb-5">
      <h3 className="text-xl font-bold mb-4 text-indigo-700">Subir Archivo al Cloud Storage</h3>
      
      {/* Input de Archivo */}
      <input
        type="file"
        className="block w-full text-sm text-gray-500 my-4 cursor-pointer hover:bg-indigo-400 hover:text-white"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {/* Botón de Carga */}
      <button
        onClick={handleUpload}
        disabled={isUploading || !file}
        className={`w-full py-3 px-4 rounded-xl text-white font-semibold transition duration-200 shadow-md ${buttonClass}`}
      >
        {isUploading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Subiendo {file ? `(${file.name})` : ''}
          </span>
        ) : (
          `Subir a Bucket '${bucketName}'`
        )}
      </button>

      {/* Mensaje de Estado */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Uploader;
