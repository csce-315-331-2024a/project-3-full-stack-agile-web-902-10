"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Users, Menu_Item, Ingredient, Ingredients_Menu } from "@prisma/client";
import { useSocket } from "@/lib/socket";
import { useCartStore } from "@/lib/provider/cart-store-provider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
    const socket: any = useSocket();
    const [menu_items, setMenuItems] = useState<Menu_Item[]>(menu_items_inital);
    const [ingredients, setIngredients] = useState<Ingredient[]>(ingredients_initial);
    const [ingredients_menu_item, setIngredientsMenuItem] = useState<Ingredients_Menu[]>(ingredients_menu_item_initial);

    useEffect(() => {
        if (socket) {
            socket.on("menuItem", (data: string) => {
                setMenuItems(JSON.parse(data));
            });
            socket.on("ingredient", (data: string) => {
                setIngredients(JSON.parse(data));
            });
            socket.on("ingredientsMenuItem", (data: string) => {
                setIngredientsMenuItem(JSON.parse(data));
            });
        }
    }, [socket]);

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
        socket.emit("orderLog:create", JSON.stringify(cart));
    };
    


    const router = useRouter();
    return (
        <>
            <div className="p-8 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <Card className="">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            {cart.map((item, index) => (
                                <div key={index} className="flex justify-between items-center mb-4">
                                    <span>{item.name}</span>
                                    <span>${item.price}</span>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="flex flex-col items-center space-y-4 font-bold p-4">
                            <div className="flex justify-between w-full">
                                <p>Total</p>
                                <p>${totalPrice.toFixed(2)}</p>
                            </div>
                            <Button variant="destructive" color="primary" className="w-full" onClick={() => { router.back() }}>
                                Back
                            </Button>
                            <Button variant="default" color="secondary" className="w-full" onClick={() => handlePaymentClick()}>
                                Pay
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    );
}
