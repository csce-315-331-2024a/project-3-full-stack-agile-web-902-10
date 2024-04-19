"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Users, Menu_Item, Ingredient, Ingredients_Menu } from "@prisma/client";
import { useSocket } from "@/lib/socket";
import { useCartStore } from "@/lib/provider/cart-store-provider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/lib/provider/language-store-provider";

export default function CheckoutPage({
    user,
    menu_items_inital,
    ingredients_initial,
    ingredients_menu_item_initial
}:
    {
        user: Users | null
        menu_items_inital: Menu_Item[]
        ingredients_initial: Ingredient[]
        ingredients_menu_item_initial: Ingredients_Menu[]
    }) {
    const socket = useSocket();
    const [menu_items, setMenuItems] = useState<Menu_Item[]>(menu_items_inital);
    const [ingredients, setIngredients] = useState<Ingredient[]>(ingredients_initial);
    const [ingredients_menu_item, setIngredientsMenuItem] = useState<Ingredients_Menu[]>(ingredients_menu_item_initial);

    const language = useLanguageStore((state) => state.language);
    let [translated, setTranslated] = useState({
        checkout: "Checkout",
        total: "Total",
        back: "Back",
        pay: "Pay"
    });

    useEffect(() => {
        if (socket) {
            socket.emit("menuItem:read", undefined, (new_menu_items: Menu_Item[]) => {
                setMenuItems(new_menu_items);
            });
            socket.on("menuItem", (new_menu_items: Menu_Item[]) => {
                setMenuItems(new_menu_items);
            });
            socket.emit("ingredient:read", undefined, (new_ingredients: Ingredient[]) => {
                setIngredients(new_ingredients);
            });
            socket.on("ingredient", (new_ingredients: Ingredient[]) => {
                setIngredients(new_ingredients);
            });

            if (language !== "en") {
                socket.emit("translateJSON", translated, language, (new_translated: typeof translated) => {
                    setTranslated(new_translated);
                });
            }
        }
    }, [socket, language]);

    const cart = useCartStore((state) => state.cart);
    const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

    const handlePaymentClick = () => {
        let isStockSufficient = true;
        let insufficientItems = [];

        for (const cartItem of cart) {
            const menuItemIngredients = ingredients_menu_item.filter(i => i.menu_id === cartItem.id);

            for (const item of menuItemIngredients) {
                const requiredQuantity = item.quantity * cartItem.quantity; // item.quantity from ingredients_menu_item multiplied by the quantity in the cart
                const ingredientInStock = ingredients.find(ing => ing.id === item.ingredients_id);

                if (!ingredientInStock || ingredientInStock.stock < requiredQuantity) {
                    isStockSufficient = false;
                    insufficientItems.push(`${ingredientInStock ? ingredientInStock.name : 'Unknown ingredient'} for ${cartItem.name}`);
                    break;
                }
            }

            if (!isStockSufficient) {
                break;
            }
        }

        if (!isStockSufficient) {
            alert(`Not enough stock for: ${insufficientItems.join(", ")}. Please adjust your cart items.`);
            return;
        }

        // If there's enough stock, proceed with the payment process
        // socket.emit("orderLog:create", JSON.stringify(cart));
    };



    const router = useRouter();
    return (
        <>
            <div className="p-8 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <Card className="">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">{translated.checkout}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            {cart.map((item, index) => (
                                <div key={index} className="flex justify-between items-center mb-4">
                                    <div className="flex-1">{item.name}</div>
                                    <div className="flex-1 text-center">Qty: {item.quantity}</div>
                                    <div className="flex-1 text-right">${item.price.toFixed(2)}</div>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="flex flex-col items-center space-y-4 font-bold p-4">
                            <div className="flex justify-between w-full">
                                <p>{translated.total}</p>
                                <p>${totalPrice.toFixed(2)}</p>
                            </div>
                            <Button variant="destructive" color="primary" className="w-full" onClick={() => { router.back() }}>
                                {translated.back}
                            </Button>
                            <Button variant="default" color="secondary" className="w-full" onClick={() => handlePaymentClick()}>
                                {translated.pay}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    );
}
