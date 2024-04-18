"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useCartStore } from "@/lib/provider/cart-store-provider";

export default function CheckoutPage() {
    const cart = useCartStore((state) => state.cart);
    const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

    const handlePaymentClick = (url: string) => {
        window.open(url, "_blank");
    };

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
                            <Button variant="default" color="primary" className="w-full" onClick={() => handlePaymentClick('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}>
                                Pay with Dine In Dollars
                            </Button>
                            <Button variant="default" color="secondary" className="w-full" onClick={() => handlePaymentClick('https://www.youtube.com/watch?v=xIKHCZl6bsY&pp=ygUlbmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXAgc2lnbiBsYW5ndWFnZQ%3D%3D')}>
                                Pay with Credit Card
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    );
}
