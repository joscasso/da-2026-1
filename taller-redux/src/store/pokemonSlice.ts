import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { PokemonDetail, PokemonState } from '../types/pokemonTypes';

const initialState: PokemonState = {
    list: [],
    filter: '', // Estado inicial del filtro
    status: 'idle',
    error: null,
};

// 💡 Thunk Asíncrono: Hace dos pasos de llamadas a la API
export const fetchPokemons = createAsyncThunk<
    PokemonDetail[],
    void,
    { rejectValue: string }
>(
    'pokemon/fetchPokemons',
    async (_, { rejectWithValue }) => {
        try {
            // 1. Obtener la lista inicial (solo nombres y URLs de detalle)
            const listResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
            const listData = await listResponse.json();
            // 2. Crear un arreglo de Promesas para obtener los detalles de cada Pokémon
            const detailPromises = listData.results.map((pokemon: { url: string }) =>
                fetch(pokemon.url).then(res => res.json())
            );
            // 3. Esperar que todas las promesas de detalle se resuelvan (Promise.all)
            const detailedResults = await Promise.all(detailPromises);
            // 4. Formatear y retornar los datos
            const formattedPokemons: PokemonDetail[] = detailedResults.map(detail => ({
                id: detail.id,
                name: detail.name,
                type: detail.types[0].type.name, // Simplificar al primer tipo
                imageUrl: detail.sprites.front_default,
            }));
            return formattedPokemons;
        } catch {
            return rejectWithValue('Error al obtener datos detallados de la PokeAPI.');
        }
    }
);

export const pokemonSlice = createSlice({
    name: 'pokemon',
    initialState,
    reducers: {
        // 🔍 Reducer Síncrono para actualizar el filtro
        setFilter: (state, action: PayloadAction<string>) => {
            state.filter = action.payload.toLowerCase();
        },
        clearPokemonList: (state) => {
            state.list = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    // ExtraReducers para manejar la acción asíncrona
    extraReducers: (builder) => {
        builder
            // ⏳ Loading
            .addCase(fetchPokemons.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            // ✅ Success
            .addCase(fetchPokemons.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            // ❌ Failed
            .addCase(fetchPokemons.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Ocurrió un error desconocido.';
                state.list = [];
            });
    },
});

export const { setFilter, clearPokemonList } = pokemonSlice.actions;
export default pokemonSlice.reducer;