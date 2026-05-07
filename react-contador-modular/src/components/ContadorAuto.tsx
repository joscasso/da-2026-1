import { useState, useEffect } from 'react';

function useContador(inicial = 0, intervalo = 1000, limit = 5000) {
    const [valor, setValor] = useState(inicial);

    useEffect(() => {
        const id = setInterval(() => {
            setValor(v => v < limit ? v + 1 : v);
        }, intervalo);

        return () => clearInterval(id);
    }, [intervalo]);

    return [valor, setValor];
}

// Uso en un componente
import React from 'react';

function ContadorAuto() {
    const [contador, setContador] = useContador(0, 1000, 10);

    return (
        <div>
            <p>Contador automático: {contador}</p>
            <button onClick={() => setContador(0)}>Reiniciar</button>
        </div>
    );
}

export default ContadorAuto;