import { createStore } from 'zustand/vanilla';
import { Menu_Item, Ingredient } from '@prisma/client';

export type CartItem = {
    menu_item: Menu_Item;
    ingredient_ids: number[];
    quantity: number;
};

export type CartState = {
    cart: CartItem[];
};

export type CartActions = {
    clearCart: () => void;
    setCart: (cart: CartItem[]) => void;
};

export type CartStore = CartState & CartActions;

export const defaultCartState: CartState = {
    cart: [],
};

export const createCartStore = (initState: CartState = defaultCartState) => {
    return createStore<CartStore>((set) => ({
        ...initState,
        clearCart: () => set({ cart: [] }),
        setCart: (new_cart: CartItem[]) => set((state) => ({ cart: [...new_cart] })),
    }));
}