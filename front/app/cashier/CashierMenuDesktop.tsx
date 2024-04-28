"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react";
import { CartItem } from "@/lib/stores/cart-store"
import { useCartStore } from "@/lib/provider/cart-store-provider"
import { Menu_Item, Users, Ingredient, Ingredients_Menu } from "@prisma/client"
import { useSocket } from "@/lib/socket";
import CashierMenuItem from "./CashierMenuItem";

export default function CashierMenuDesktop({ menu_items_init, ingredients_init, ingredient_menus_init, user }: { menu_items_init: Menu_Item[], ingredients_init: Ingredient[], ingredient_menus_init: Ingredients_Menu[], user: Users | null }) {
    // make a state for the selected category
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [menu_items, setMenuItems] = useState<Menu_Item[]>(menu_items_init);
    const [ingredients, setIngredients] = useState<Ingredient[]>(ingredients_init);
    const [ingredient_menus, setIngredientMenus] = useState<Ingredients_Menu[]>(ingredient_menus_init);
    const [categories, setCategories] = useState<string[]>(Array.from(new Set(menu_items_init.map((item) => item.category))));

    const some_cart = useCartStore((state) => state.cart);
    let cart = some_cart;

    const findMissingIngredients = (cart_item: CartItem) => {
        let ingredients_in_menu_item = ingredient_menus.filter((ingredient_menu) => ingredient_menu.menu_id === cart_item.menu_item.id);
        let selectedIngredients = ingredients_in_menu_item.map((ingredient_in_menu_item) => ingredient_in_menu_item.ingredients_id);
        return arrayDifference(selectedIngredients, cart_item.ingredient_ids);
    }

    const arrayDifference = (array1: number[], array2: number[]) => {
        let difference = [];
        for (let i = 0; i < array1.length; i++) {
            if (array2.indexOf(array1[i]) === -1) {
                difference.push(array1[i]);
            }
        }
        return difference;
    }

    const returnIngredientName = (ingredient_id: number) => {
        for (let i = 0; i < ingredients.length; ++i) {
            if (ingredients[i].id === ingredient_id) {
                return ingredients[i].name;
            }
        }
        return "";
    }

    const socket = useSocket();
    useEffect(() => {
        if (socket) {
            socket.emit("ingredientMenu:read", undefined, (new_ingredient_menus: Ingredients_Menu[]) => {
                setIngredientMenus(new_ingredient_menus);
            });
            socket.on("ingredientMenu", (new_ingredient_menus: Ingredients_Menu[]) => {
                setIngredientMenus(new_ingredient_menus);
            });

            socket.emit("menuItem:read", { where: { is_active: true } }, (new_menu_items: Menu_Item[]) => {
                new_menu_items = new_menu_items.filter((item) => item.is_active && (item.date === null || new Date(item.date).getTime() >= new Date().getTime()));
                setMenuItems(new_menu_items);
            });
            socket.on("menuItem", (new_menu_items: Menu_Item[]) => {
                // filter out non-active items
                new_menu_items = new_menu_items.filter((item) => item.is_active && (item.date === null || new Date(item.date).getTime() >= new Date().getTime()));
                setMenuItems(new_menu_items);
            });
            socket.emit("ingredient:read", undefined, (new_ingredients: Ingredient[]) => {

                setIngredients(new_ingredients);

            });
            socket.on("ingredient", (new_ingredients: Ingredient[]) => {
                setIngredients(new_ingredients);
            });
        }
    }, [socket]);

    return (
        <div className="flex flex-row">
            <div className="h-[90vh] w-[30vw] p-10 whitespace-nowrap">
                <div className="flex flex-col w-[20vw] space-y-8 justify-center items-center transition-all">
                    <h1 className="text-xl font-bold items-center"> Current Cart </h1>
                    <Separator />
                    <ScrollArea className="h-[68vh] w-[23vw] pl-4 whitespace-nowrap border-2 rounded-sm">
                        {cart.map((item) => (
                            <div key={item.menu_item.id}>
                                <div className="flex justify-between space-x-12">
                                    {/* <p className="text-xl py-4 m-4">Qty: {item.quantity}</p> */}
                                    <p className="text-xl m-4">x{item.quantity} {item.menu_item.name} ${item.menu_item.price * item.quantity}</p>
                                    {/* <p className="text-xl py-4 m-4">${item.menu_item.price * item.quantity}</p> */}
                                </div>
                                <div className="indent-24">
                                    {findMissingIngredients(item).map((ingredient_id: number) => (
                                        <p key={ingredient_id}>- No {returnIngredientName(ingredient_id)}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <ScrollBar orientation="vertical" />
                    </ScrollArea>
                    <div className="flex justify-between border-2 rounded-sm">
                        <p className="px-2 py-1">Total: ${cart.reduce((acc, item) => acc + item.menu_item.price * item.quantity, 0)}</p>
                    </div>
                </div>
            </div>
            <ScrollArea className="h-[90vh] w-[90vw] p-8 whitespace-nowrap">
                <div className="grid grid-cols-3 gap-4 transition-all">
                    {menu_items.filter((menu_item) => selectedCategory === undefined || menu_item.category === selectedCategory).map((menu_item) => (
                        <CashierMenuItem key={menu_item.name} menu_item={menu_item} ingredients={ingredients} ingredient_menus={ingredient_menus} />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
