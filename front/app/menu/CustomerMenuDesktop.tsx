"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { useState, useEffect, use } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { useCartStore } from "@/lib/provider/cart-store-provider"
import { Menu_Item, Users } from "@prisma/client"
import { MenuItemRead, useSocket } from "@/lib/socket";
import { useLanguageStore } from "@/lib/provider/language-store-provider";

const static_text = {
    category: "Category",
    add_to_cart: "Add to Cart",
}

export default function CustomerMenuDesktop({ menu_items_init, user }: { menu_items_init: Menu_Item[], user: Users | null }) {
    // make a state for the selected category
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [menu_items, setMenuItems] = useState<Menu_Item[]>(menu_items_init);
    const [categories, setCategories] = useState<string[]>(Array.from(new Set(menu_items_init.map((item) => item.category))));

    const onCategoryClick = (category: string) => {
        if (selectedCategory === category) {
            setSelectedCategory(undefined);
        } else {
            setSelectedCategory(category);
        }
    }

    const add = useCartStore((state) => state.addToCart);
    const onAddToCart = (menu_item: Menu_Item) => {
        add(menu_item);
    }

    // All data that needs to be processed by the server should be sent through the socket
    const language = useLanguageStore((state) => state.language);
    const [current_language, setCurrentLanguage] = useState(language);
    let [translated, setTranslated] = useState(static_text);

    const socket = useSocket();
    useEffect(() => {
        if (socket) {
            socket.emit("menuItem:read", undefined, (new_menu_items: Menu_Item[]) => {
                if (language !== "English") {
                    socket.emit("translateArray", new_menu_items.map((item) => item.name), language, (translated_names: string[]) => {
                        new_menu_items.forEach((item, index) => {
                            item.name = translated_names[index];
                        });
                        socket.emit("translateArray", new_menu_items.map((item) => item.category), language, (translated_categories: string[]) => {
                            new_menu_items.forEach((item, index) => {
                                item.category = translated_categories[index];
                            });
                            setMenuItems(new_menu_items);
                            setCategories(Array.from(new Set(new_menu_items.map((item) => item.category))));
                            setCurrentLanguage(language);
                        });
                    });
                }
                else {
                    setMenuItems(new_menu_items);
                    setCategories(Array.from(new Set(new_menu_items.map((item) => item.category))));
                }
            });
            socket.on("menuItem", (new_menu_items: Menu_Item[]) => {
                if (language !== "English") {
                    socket.emit("translateArray", new_menu_items.map((item) => item.name), language, (translated_names: string[]) => {
                        new_menu_items.forEach((item, index) => {
                            item.name = translated_names[index];
                        });
                        socket.emit("translateArray", new_menu_items.map((item) => item.category), language, (translated_categories: string[]) => {
                            new_menu_items.forEach((item, index) => {
                                item.category = translated_categories[index];
                            });
                            setMenuItems(new_menu_items);
                            setCategories(Array.from(new Set(new_menu_items.map((item) => item.category))));
                        });
                    });
                }
                else {
                    setMenuItems(new_menu_items);
                    setCategories(Array.from(new Set(new_menu_items.map((item) => item.category))));
                }
            });

            if (language !== "English") {
                socket.emit("translateJSON", translated, language, (new_translated: typeof translated) => {
                    setTranslated(new_translated);
                });
            }
            else {
                setTranslated(static_text);
            }
        }
    }, [socket, language]);

    return (
        <div className="hidden lg:flex flex-row">
            <ScrollArea className="h-[92vh] w-auto p-10 whitespace-nowrap">
                <div className="flex flex-col w-[10vw] space-y-8 justify-center items-center transition-all">
                    <h1 className="text-lg font-bold"> {translated.category} </h1>
                    <Separator />
                    {categories.map((cat) => (
                        <Button key={cat} variant={selectedCategory === cat ? "default" : "secondary"} className="w-[8vw] h-[9vh] text-lg font-bold whitespace-normal" onClick={() => onCategoryClick(cat)}> {cat} </Button>
                    ))}
                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>
            <ScrollArea className="h-[92vh] w-[90vw] p-8 whitespace-nowrap">
                <div className="grid grid-cols-3 gap-4 transition-all">
                    {menu_items.filter((menu_item) => selectedCategory === undefined || menu_item.category === selectedCategory).map((menu_item) => (
                        <Dialog key={menu_item.id}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="flex-col justify-evenly w-[25vw] h-[40vh]">
                                    <h2 className="text-2xl font-bold">{menu_item.name}</h2>
                                    <Image
                                        src={menu_item.image_url}
                                        width={200}
                                        height={200}
                                        alt={menu_item.name}
                                        className="aspect-[1/1] h-[200px] w-[200px] object-cover rounded-3xl border"
                                    />
                                    <h2 className="text-2xl">${menu_item.price}</h2>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{menu_item.name}</DialogTitle>
                                    <DialogDescription>${menu_item.price}</DialogDescription>
                                </DialogHeader>
                                <Image
                                    src={menu_item.image_url}
                                    width={200}
                                    height={200}
                                    alt={menu_item.name}
                                    className="aspect-[1/1] h-[200px] w-[200px] object-cover rounded-3xl border"
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="default" onClick={() => onAddToCart(menu_item)}> {translated.add_to_cart} </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
