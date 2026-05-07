"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cola {
    items = [];
    agregar(item) {
        this.items.push(item);
    }
    obtenerPrimerElemento() {
        return this.items.shift();
    }
}
const colaNumeros = new Cola();
colaNumeros.agregar(10);
colaNumeros.agregar(20);
const primerNumero = colaNumeros.obtenerPrimerElemento(); // Tipo: number
console.log(primerNumero);
const colaCadenas = new Cola();
colaCadenas.agregar('Pepe');
colaCadenas.agregar('Maria');
const primerNombre = colaCadenas.obtenerPrimerElemento(); // Tipo: string
console.log(primerNombre);
//# sourceMappingURL=main.js.map