import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Importamos 'createSelector' de reselect para selectores optimizados
import { createSelector } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from '../store';
import { fetchPokemons, setFilter } from '../store/pokemonSlice';
import type { PokemonDetail } from '../types/pokemonTypes';
// 🔍 SELECTOR AVANZADO: Lógica de Filtrado (Estado Derivado)
// Combina los datos de la lista y el estado del filtro para devolver un resultado
const selectFilteredPokemons = createSelector(
    // Input Selectors
    (state: RootState) => state.pokemon.list,
    (state: RootState) => state.pokemon.filter,
    // Output Selector (Función que ejecuta la lógica de filtrado)
    (list: PokemonDetail[], filter: string) => {
        if (!filter) {
            return list;
        }
        // Lógica de Filtrado: Coincidencia por nombre O por categoría (tipo)
        return list.filter(pokemon =>
            pokemon.name.includes(filter) || pokemon.type.includes(filter)
        );
    }
);
const PokemonList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    // Usamos el selector avanzado para obtener la lista YA FILTRADA
    const filteredList = useSelector(selectFilteredPokemons);
    // Obtenemos los estados para la UI
    const { status, error, filter } = useSelector((state: RootState) => state.pokemon);
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPokemons());
        }
    }, [status, dispatch]);
    if (status === 'loading') {
        return <p>⏳ Cargando Pokémones, realizando múltiples llamadas a la API...</p>;
    }
    if (status === 'failed') {
        return <p style={{ color: 'red' }}>❌ Error de Carga: {error}</p>;
    }
    return (
        <div>
            <h2>Pokédex (Estado Sincronizado)</h2>
            {/* Input para el filtro que despacha una acción síncrona */}
            <input
                type="text"
                placeholder="Filtrar por nombre o categoría (ej: charmander o fire)"
                value={filter}
                onChange={(e) => dispatch(setFilter(e.target.value))} // ➡️ Despacha setFilter
                style={{ width: '80%', padding: '10px', marginBottom: '20px' }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                {filteredList.map((pokemon) => (
                    <div
                        key={pokemon.id}
                        style={{
                            border: '1px solid #ccc',
                            padding: '10px',
                            textAlign: 'center'
                        }}
                    >
                        <img src={pokemon.imageUrl} alt={pokemon.name} style={{ width: '80px' }} />
                        <p><strong>{pokemon.name.toUpperCase()}</strong></p>
                        <p>Tipo: <span style={{
                            color: 'blue'
                        }}>{pokemon.type.toUpperCase()}</span></p>
                    </div>
                ))}
            </div>
            {filteredList.length === 0 && status === 'succeeded' && (
                <p>No se encontraron Pokémones con el filtro: **{filter}**</p>
            )}
        </div>
    );
};
export default PokemonList;