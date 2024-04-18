// import { createStore } from 'zustand/vanilla'

// export type CounterState = {
//   count: number
// }

// export type CounterActions = {
//   decrementCount: () => void
//   incrementCount: () => void
// }

// export type CounterStore = CounterState & CounterActions

// export const defaultInitState: CounterState = {
//   count: 0,
// }

// export const createCounterStore = (
//   initState: CounterState = defaultInitState,
// ) => {
//   return createStore<CounterStore>()((set) => ({
//     ...initState,
//     decrementCount: () => set((state) => ({ count: state.count - 1 })),
//     incrementCount: () => set((state) => ({ count: state.count + 1 })),
//   }))
// }

import { createStore } from 'zustand/vanilla';
import { Menu_Item } from '@prisma/client';

export type CartState = {
    cart: Menu_Item[];
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
                return { cart: [...state.cart, item] };
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