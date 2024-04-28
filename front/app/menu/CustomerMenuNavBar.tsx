"use client";

import Link from "next/link";
import { signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { Button, buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Users, Ingredients_Menu, Menu_Item, Ingredient } from "@prisma/client";
import { CartItem } from "@/lib/stores/cart-store"
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
import { set } from "date-fns";

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
    language: "Language",
    sign_in: "Sign In",
    sign_out: "Sign Out",
}

export default function CustomerMenuNavBar({ user, ingredient_menus, ingredients }: { user: Users | null, ingredient_menus: Ingredients_Menu[], ingredients: Ingredient[] }) {
    const { theme, setTheme } = useTheme();

    // get add to cart store
    const some_cart = useCartStore((state) => state.cart);
    let cart = some_cart;
    const setCart = useCartStore((state) => state.setCart);
    const clearCart = useCartStore((state) => state.clearCart);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    }

    const findMissingIngredients = (cart_item: CartItem ) => {
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

    const compare = (array1: number[], array2: number[]) => {

        if (array1.length != array2.length) {
            return false;
        }

        for (let i = 0; i < array1.length; ++i) {
            if (array1[i] != array2[i]) {
                return false;
            }
        }

        return true;
    }

    const removeItem = (item: CartItem) => {
        for (let i = 0; i < cart.length; ++i) {
            if (item.menu_item.id === cart[i].menu_item.id && compare(item.ingredient_ids, cart[i].ingredient_ids)) {
                if (cart[i].quantity > 1) {
                    cart[i].quantity -= 1;
                    setCart(cart);
                    return;
                }
                else {
                    cart.splice(i,1);
                    setCart(cart);
                    return;
                }
            }
        }
    }

    const returnIngredientName = (ingredient_id: number) => {
        for (let i = 0; i < ingredients.length; ++i) {
            if (ingredients[i].id === ingredient_id) {
                return ingredients[i].name;
            }
        }
        return "";
    }

    // All data that needs to be processed by the server should be sent through the socket
    const language = useLanguageStore((state) => state.language);
    const setLanguage = useLanguageStore((state) => state.setLanguage);
    let [translated, setTranslated] = useState(static_text);

    useEffect(() => {
        cart = some_cart;
    }, [some_cart]);

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
                                    <ScrollArea className="flex-col space-y-4 m-8">
                                        {cart.map((item) => (
                                            <div>
                                                <div key={item.menu_item.id} className="flex justify-between space-x-12">
                                                    <p className="text-xl py-4 m-4">
                                                        <Button key={"decrease item"} variant={item.quantity > 1 ? "outline" : "destructive"} onClick={() => removeItem(item)}>{item.quantity > 1 ? "-" : "X"}</Button>
                                                    </p>
                                                    <p className="text-xl py-4 m-4">Qty: {item.quantity}</p>
                                                    <p className="text-xl py-4 m-4">{item.menu_item.name}</p>
                                                    <p className="text-xl py-4 m-4">${item.menu_item.price * item.quantity}</p>
                                                </div>
                                                <div className="indent-24">
                                                {findMissingIngredients(item).map((ingredient_id) => (
                                                        <p>- No {returnIngredientName(ingredient_id)}</p>
                                                    ))}  
                                                </div>
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
                                        <LanguageSelector translated={translated} id="language"/>
                                        <Label htmlFor="language">{translated.language}</Label>
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
