"use client";

import Link from "next/link";
import { signIn, signOut } from 'next-auth/react';
import { use, useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { Button, buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Users, Ingredients_Menu, Menu_Item, Ingredient, Roles } from "@prisma/client";
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
import { useToast } from "@/components/ui/use-toast"

import { useCartStore } from "@/lib/provider/cart-store-provider";
import { useLanguageStore } from "@/lib/provider/language-store-provider";
import { KitchenCreate, useSocket } from "@/lib/socket";
import LanguageSelector from "@/components/LanguageSelector.";
import { getTemperature } from "../api/weather";

const static_text = {
    welcome: "Welcome",
    cart: "Cart",
    review_order: "Review your order here.",
    total: "Total",
    checkout: "Checkout",
    clear_cart: "Clear Cart",
    settings: "Settings",
    make_changes: "Make changes to your session here.",
    dark_mode: "High Contrast",
    language: "Language",
    sign_in: "Sign In",
    sign_out: "Sign Out",
    dine_in: "Dine In",
    credit: "Credit Card",
    checkout_desc: "Checkout here.",
    no: "No",
    qty: "Qty",
}

export default function CustomerMenuNavBar({ user, ingredient_menus, ingredients }: { user: Users | null, ingredient_menus: Ingredients_Menu[], ingredients: Ingredient[] }) {
    const { theme, setTheme } = useTheme();

    // get add to cart store
    const some_cart = useCartStore((state) => state.cart);
    let cart = some_cart;
    const setCart = useCartStore((state) => state.setCart);
    const clearCart = useCartStore((state) => state.clearCart);
    const [currentUser, setCurrentUser] = useState<Users | null>(user);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    }

    const findMissingIngredients = (cart_item: CartItem) => {
        let ingredients_in_menu_item = ingredient_menus.filter((ingredient_menu) => ingredient_menu.menu_id === cart_item.menu_item.id);
        let selectedIngredients = ingredients_in_menu_item.map((ingredient_in_menu_item) => ingredient_in_menu_item.ingredients_id);
        return arrayDifference(selectedIngredients, cart_item.ingredient_ids);
    }

    const arrayDifference = (array1: number[], array2: number[]) => {
        let difference: number[] = [];
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
                    cart.splice(i, 1);
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

    const { toast } = useToast();
    const placeOrder = () => {
        const num = new Date().getTime() % 34212;
        for (let i = 0; i < cart.length; ++i) {
            for (let j = 0; j < cart[i].quantity; ++j) {
                handleKitchenCreation(cart[i].menu_item.id, cart[i].ingredient_ids.toString(), num);
            }
        }
        clearCart();
        const customer_text = "Order ID: " + num;
        toast({
            title: "Order Complete",
            description: customer_text
        });
    }

    // All data that needs to be processed by the server should be sent through the socket
    const language = useLanguageStore((state) => state.language);
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

            socket.on("users", (users: Users[]) => {
                setCurrentUser(users.find((user) => user.id === currentUser?.id) || null);
            });
        }
    }, [socket, language]);

    const [temprature, setTemperature] = useState(0);

    useEffect(() => {
        getTemperature().then((temp) => {
            setTemperature(temp);
        });
    });

    function handleKitchenCreation(menu_id: number, ingredient_ids: string, order_id: number) {
        const email = user?.email;
        let kitchen_create: KitchenCreate = {
            data: {
                menu_id: menu_id,
                ingredients_ids: ingredient_ids,
                order_id: order_id,
            }
        }
        if (user) {
            kitchen_create.data.email = email;
        }
        socket.emit("kitchen:create", kitchen_create);
    }

    return (
        <div className="border-b">
            <div className="flex h-[8vh] items-center justify-center px-4">
                <nav className="flex w-full item-center justify-center md:mx-12">
                    <div className="flex justify-start border-2 rounded-sm">
                        {(currentUser !== null && currentUser?.role !== Roles.Customer) && <Link href="/manager" className="px-2 py-1 text-xl font-bold transition-colors hover:text-primary">Dashboard</Link>}
                        {(currentUser === null || currentUser?.role === Roles.Customer) && <p className="px-2 py-1 text-xl font-bold transition-colors"> {temprature + " °F"} </p>}
                    </div>
                    <div className="flex justify-center flex-grow flex-col">
                        {cart.length <= 0 ?
                            <p className="text-xl font-bold text-center">{user?.name === undefined ? "Rev's American Grill" : translated.welcome + ", " + user.name.split(" ")[0]}</p> :
                            <Drawer direction="right">
                                <DrawerTrigger>
                                    <Button variant="default" className="text-xl font-bold">{"Cart: " + cart.reduce((acc, item) => acc + item.quantity, 0)}</Button>
                                </DrawerTrigger>
                                <DrawerContent showBar={false} className="h-screen top-0 right-0 left-auto mt-0 w-auto rounded-none">
                                    <DrawerHeader>
                                        <DrawerTitle className="pt-4 text-xl">{translated.cart}</DrawerTitle>
                                        <DrawerDescription className="text-xl">{translated.review_order}</DrawerDescription>
                                    </DrawerHeader>
                                    <ScrollArea className="flex-col space-y-4">
                                        {cart.map((item) => (
                                            <div key={item.menu_item.id} className="flex flex-col justify-evenly bg-background shadow-sm hover:bg-accent hover:text-accent-foreground w-full">
                                                <div className="flex justify-start w-full">
                                                    <p className="text-xl py-4 m-4">
                                                        <Button aria-label="Decrement cart item" className="w-[4vw] h-[4vh] text-xl" variant={item.quantity > 1 ? "outline" : "destructive"} onClick={() => removeItem(item)}>{item.quantity > 1 ? "-" : "X"}</Button>
                                                    </p>
                                                    <div className="flex flex-col w-full justify-center">
                                                        <div className="flex flex-row w-full justify-between items-center">
                                                            <p className="text-xl m-4 self-start">{translated.qty}: {item.quantity}</p>
                                                            <p className="text-xl m-4 self-stretch">{item.menu_item.name}</p>
                                                            <p className="text-xl m-4 self-end">${item.menu_item.price * item.quantity}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="indent-24">
                                                    {findMissingIngredients(item).map((ingredient_id) => (
                                                        <p className="pb-4" key={ingredient_id}>-{translated.no} {returnIngredientName(ingredient_id)}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </ScrollArea>
                                    <DrawerFooter>
                                        {/* Calculate total */}
                                        <div className="pt-4 flex justify-center gap-x-4 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
                                            <p>{translated.total}</p>
                                            <p>${cart.reduce((acc, item) => acc + item.menu_item.price * item.quantity, 0)}</p>
                                        </div>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="default" >{translated.checkout}</Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[400px]">
                                                <DialogHeader>
                                                    <DialogTitle>{translated.checkout}</DialogTitle>
                                                    <DialogDescription>
                                                        {translated.checkout_desc}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="flex justify-between text-xl">
                                                    <p>{translated.total}</p>
                                                    <p>${cart.reduce((acc, item) => acc + item.menu_item.price * item.quantity, 0)}</p>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button type="submit" onClick={() => placeOrder()}>{translated.dine_in}</Button>
                                                    </DialogClose>
                                                    <DialogClose asChild>
                                                        <Button type="submit" onClick={() => placeOrder()}>{translated.credit}</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        <Button variant="destructive" className="" onClick={() => clearCart()}>{translated.clear_cart}</Button>
                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>
                        }
                    </div>
                    <div className="flex justify-end gap-x-16 border-2 rounded-sm">
                        <Dialog>
                            <DialogTrigger className="px-2 py-1 text-xl font-bold transition-colors hover:text-primary">{translated.settings}</DialogTrigger>
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
                                        <LanguageSelector translated={translated} id="language" />
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
