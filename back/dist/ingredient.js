"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIngredients = void 0;
async function getIngredients() {
    const response = await fetch('http://localhost:3000/ingredients');
    return await response.json();
}
exports.getIngredients = getIngredients;
