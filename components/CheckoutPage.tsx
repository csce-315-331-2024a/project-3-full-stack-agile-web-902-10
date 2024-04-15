"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useCartStore } from "@/lib/provider/cart-store-provider";
import CheckoutNavBar from "@/components/CheckoutNavBar";

export default function CheckoutPage() {
    const cart = useCartStore((state) => state.cart);
    const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

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
                        <CardFooter className="flex justify-between items-center font-bold p-4">
                            <p>Total</p>
                            <p>${totalPrice.toFixed(2)}</p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    );
}