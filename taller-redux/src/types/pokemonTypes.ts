// 1. Tipo para un Pokémon con detalles
export interface PokemonDetail {
    id: number;
    name: string;
    type: string; // La categoría/tipo principal (ej: 'fire', 'water')
    imageUrl: string; // URL del sprite frontal
}

// 2. Tipo del Estado Global en el Slice
export interface PokemonState {
    list: PokemonDetail[];
    filter: string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}