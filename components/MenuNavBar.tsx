"use client";
import Link from "next/link";
import { signIn, signOut } from 'next-auth/react';
import * as React from "react";
import { useTheme } from "next-themes";

import { Button, buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Menu_Item } from "@prisma/client";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

import { useCartStore } from "@/lib/provider/cart-store-provider";


export default function MenuNavBar({ username, is_manager }: { username: string | undefined, is_manager: boolean | undefined }) {
    const { theme, setTheme } = useTheme();

    // get add to cart store
    const cart = useCartStore((state) => state.cart);
    const clearCart = useCartStore((state) => state.clearCart);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    }

    return (
        <div className="border-b">
            <div className="flex h-[8vh] items-center justify-center px-4">
                <nav className="flex w-full item-center justify-center md:mx-12">
                    <div className="flex justify-start">
                        <Link
                            href={is_manager === undefined ? "https://www.weather.gov/" : "/manager"}
                            className="text-lg font-bold transition-colors hover:text-primary"
                        >
                            {is_manager === undefined ? "68 F" : "Manager"}
                        </Link>
                    </div>
                    <div className="flex justify-between px-10">
                        <Link
                            href={is_manager === undefined ? "" : "/cashier"}
                            className="text-lg font-bold transition-colors hover:text-primary"
                        >
                            {is_manager === undefined ? "" : "Cashier"}
                        </Link>
                    </div>
                    <div className="flex justify-center flex-grow">
                        {cart.length <= 0 ?
                            <p className="text-lg font-bold text-center">{username === undefined ? "Rev's Grill" : "Welcome, " + username.split(" ")[0]}</p> :
                            <Drawer direction="bottom">
                                <DrawerTrigger>
                                    <Button variant="default" className="text-lg font-bold">{cart.length} items in cart</Button>
                                </DrawerTrigger>
                                <DrawerContent>
                                    <DrawerHeader>
                                        <DrawerTitle>Cart</DrawerTitle>
                                        <DrawerDescription>Review your order here.</DrawerDescription>
                                    </DrawerHeader>
                                    <div className="flex-col space-y-4 p-4">
                                        {cart.map((item) => (
                                            <div key={item.id} className="flex justify-between">
                                                <p>{item.name}</p>
                                                <p>${item.price}</p>
                                            </div>
                                        ))}
                                        {/* Calculate total */}
                                        <div className="flex justify-between">
                                            <p>Total</p>
                                            <p>${cart.reduce((acc, item) => acc + item.price, 0)}</p>
                                        </div>
                                    </div>
                                    <DrawerFooter>
                                        <Link href={"/checkout/"} className={buttonVariants({ variant : "default"})} >Checkout</Link>
                                        <Button variant="destructive" className="p-4" onClick={() => clearCart()}>Clear Cart</Button>
                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>
                        }
                    </div>
                    <div className="flex justify-end">
                        <Dialog>
                            <DialogTrigger className="text-lg font-bold transition-colors hover:text-primary">Settings</DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Settings</DialogTitle>
                                    <DialogDescription>Make changes to your session here.</DialogDescription>
                                </DialogHeader>
                                <div className="flex-col space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Switch checked={theme === "dark" ? true : false} onCheckedChange={toggleTheme} id="dark-mode" />
                                        <Label htmlFor="dark-mode">Dark Mode</Label>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Switch id="another-setting" />
                                        <Label htmlFor="another-setting">another setting</Label>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {username === undefined ?
                                            <Button variant={"outline"} onClick={() => signIn('google', { callbackUrl: "/menu" })}>Sign In</Button> :
                                            <Button variant={"destructive"} onClick={() => signOut()}>Sign Out</Button>
                                        }
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </nav>
            </div>
        </div>
    );
}
