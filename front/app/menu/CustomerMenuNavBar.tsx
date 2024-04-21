"use client";

import Link from "next/link";
import { signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { Button, buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Users } from "@prisma/client";
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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel
} from "@/components/ui/select"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator";


import { useCartStore } from "@/lib/provider/cart-store-provider";
import { useLanguageStore } from "@/lib/provider/language-store-provider";
import { useSocket } from "@/lib/socket";
import LanguageSelector from "@/components/LanguageSelector.";

const static_text = {
    welcome: "Welcome",
    cart: "Cart",
    review_order: "Review your order here.",
    total: "Total",
    checkout: "Checkout",
    clear_cart: "Clear Cart",
    settings: "Settings",
    make_changes: "Make changes to your session here.",
    dark_mode: "Dark Mode",
    another_setting: "another setting",
    sign_in: "Sign In",
    sign_out: "Sign Out",
}

export default function CustomerMenuNavBar({ user }: { user: Users | null }) {
    const { theme, setTheme } = useTheme();

    // get add to cart store
    const cart = useCartStore((state) => state.cart);
    const setCart = useCartStore((state) => state.setCart);
    const clearCart = useCartStore((state) => state.clearCart);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    }

    // All data that needs to be processed by the server should be sent through the socket
    const language = useLanguageStore((state) => state.language);
    const setLanguage = useLanguageStore((state) => state.setLanguage);
    let [translated, setTranslated] = useState(static_text);

    const socket = useSocket();
    useEffect(() => {
        if (socket) {
            if (language !== "English") {
                socket.emit("translateJSON", translated, language, (new_translated: typeof translated) => {
                    setTranslated(new_translated);
                });
            } else {
                setTranslated(static_text);
            }
        }
    }, [socket, language]);

    return (
        <div className="border-b pt-4">
            <div className="flex h-[6vh] items-center justify-center px-4">
                <nav className="flex w-full item-center justify-center md:mx-12">
                    <div className="flex justify-start">
                        <Link
                            href={user?.is_manager === undefined ? "https://www.weather.gov/" : "/manager"}
                            className="text-lg font-bold transition-colors hover:text-primary"
                        >
                            {user?.is_manager === undefined ? "68 F" : "Manager"}
                        </Link>
                    </div>
                    <div className="flex justify-start px-10">
                        <Link
                            href={user?.is_employee === true ? "/cashier" : ""}
                            className="text-lg font-bold transition-colors hover:text-primary"
                        >
                            {user?.is_employee === true ? "Cashier" : ""}
                        </Link>
                    </div>
                    <div className="flex justify-center flex-grow">
                        {cart.length <= 0 ?
                            <p className="text-xl font-bold text-center">{user?.name === undefined ? "Rev's Grill" : translated.welcome + ", " + user.name.split(" ")[0]}</p> :
                            <Drawer direction="right">
                                <DrawerTrigger>
                                    <Button variant="default" className="text-lg font-bold">{"Cart: " + cart.reduce((acc, item) => acc + item.quantity, 0)}</Button>
                                </DrawerTrigger>
                                <DrawerContent showBar={false} className="h-screen top-0 right-0 left-auto mt-0 w-auto rounded-none">
                                    <DrawerHeader>
                                        <DrawerTitle>{translated.cart}</DrawerTitle>
                                        <DrawerDescription>{translated.review_order}</DrawerDescription>
                                    </DrawerHeader>
                                    <ScrollArea className="flex-col space-y-8 m-8">
                                        {cart.map((item) => (
                                            <div key={item.menu_item.id} className="flex justify-between space-x-12">
                                                <p className="text-xl py-4 m-4">Qty: {item.quantity}</p>
                                                <p className="text-xl py-4 m-4">{item.menu_item.name}</p>
                                                <p className="text-xl py-4 m-4">${item.menu_item.price}</p>
                                            </div>
                                        ))}
                                    </ScrollArea>
                                    <DrawerFooter>
                                        {/* Calculate total */}
                                        <div className="flex justify-between">
                                            <p>{translated.total}</p>
                                            <p>${cart.reduce((acc, item) => acc + item.menu_item.price * item.quantity, 0)}</p>
                                        </div>
                                        <Link href={"/checkout/"} className={buttonVariants({ variant: "default" })} >{translated.checkout}</Link>
                                        <Button variant="destructive" className="p-4" onClick={() => clearCart()}>{translated.clear_cart}</Button>
                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>
                        }
                    </div>
                    <div className="flex justify-end gap-x-16">
                        <LanguageSelector translated={translated} />
                        <Dialog>
                            <DialogTrigger className="text-lg font-bold transition-colors hover:text-primary">{translated.settings}</DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{translated.settings}</DialogTitle>
                                    <DialogDescription>{translated.make_changes}</DialogDescription>
                                </DialogHeader>
                                <div className="flex-col space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Switch checked={theme === "dark" ? true : false} onCheckedChange={toggleTheme} id="dark-mode" />
                                        <Label htmlFor="dark-mode">{translated.dark_mode}</Label>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Switch id="another-setting" />
                                        <Label htmlFor="another-setting">{translated.another_setting}</Label>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {user?.name === undefined ?
                                            <Button variant={"outline"} onClick={() => signIn('google', { callbackUrl: "/menu" })}>{translated.sign_in}</Button> :
                                            <Button variant={"destructive"} onClick={() => signOut()}>{translated.sign_out}</Button>
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
