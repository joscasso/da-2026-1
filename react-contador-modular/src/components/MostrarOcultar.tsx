import React, { useState } from 'react';

function MostrarOcultar() {
    const [visible, setVisible] = useState(true);

    return (
        <div>
            <button onClick={() => setVisible(!visible)}>
                {visible ? 'Ocultar' : 'Mostrar'}
            </button>
            {visible && <p>Este texto se puede ocultar.</p>}
        </div>
    );
}

export default MostrarOcultar;