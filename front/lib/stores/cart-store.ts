import { createStore } from 'zustand/vanilla';
import { Menu_Item } from '@prisma/client';

type CartItem = Menu_Item & { quantity: number };

export type CartState = {
    cart: CartItem[];
};

export type CartActions = {
    addToCart: (item: Menu_Item) => void;
    removeFromCart: (item: Menu_Item) => void;
    clearCart: () => void;
};

export type CartStore = CartState & CartActions;

export const defaultCartState: CartState = {
    cart: [],
};

export const createCartStore = (initState: CartState = defaultCartState) => {
    return createStore<CartStore>((set) => ({
        ...initState,
        addToCart: (item) =>
            set((state) => {
                const index = state.cart.findIndex((i) => i.id === item.id);
                if (index === -1) {
                    return { cart: [...state.cart, { ...item, quantity: 1 }] };
                }
                const newCart = [...state.cart];
                newCart[index].quantity += 1;
                return { cart: newCart };
            }),
        removeFromCart: (item) =>
            set((state) => {
                const index = state.cart.findIndex((i) => i.id === item.id);
                if (index === -1) {
                    return state;
                }
                const newCart = [...state.cart];
                newCart.splice(index, 1);
                return { cart: newCart };
            }),
        clearCart: () => set(() => ({ cart: [] })),
    }));
}