"use client";


import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Menu_Item, Users } from "@prisma/client"
import { useState, useEffect } from "react";
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
import Image from "next/image"

import { useCartStore } from "@/lib/provider/cart-store-provider"
import { useSocket } from "@/lib/socket";
import { useLanguageStore } from "@/lib/provider/language-store-provider";

export default function CustomerMenuMobile({ menu_items_init, categories_init, user }: { menu_items_init: Menu_Item[], categories_init: string[], user: Users | null }) {
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
    let [translated, setTranslated] = useState({
        to: language,
        text: {
            category: "Category",
            add_to_cart: "Add to Cart"
        }
    });

    const socket= useSocket();
    useEffect(() => {
        if (socket) {
            socket.emit("menuItem:read", undefined, (new_menu_items: Menu_Item[]) => {
                setMenuItems(new_menu_items);
                setCategories(Array.from(new Set(new_menu_items.map((item) => item.category))));
            });
            socket.on("menuItem", (new_menu_items: Menu_Item[]) => {
                setMenuItems(new_menu_items);
                setCategories(Array.from(new Set(new_menu_items.map((item) => item.category))));
            });

            // if (translated.to != "en") {
            //     socket.emit("translateJSON", JSON.stringify(translated), (data: string) => {
            //         let parsed = JSON.parse(data);
            //         setTranslated(parsed);
            //     });
            // }
        }
    }, [socket]);

    return (
        <div className="lg:hidden flex flex-col justify-center items-center">
            <ScrollArea className="w-[98vw] py-4 m-2 border rounded-lg whitespace-nowrap overflow-y-hidden">
                <div className="flex w-max space-x-4 px-6 justify-between">
                    {categories.map((cat) => (
                        <div key={cat}>
                            <Button key={cat} variant={selectedCategory === cat ? "default" : "secondary"} onClick={() => onCategoryClick(cat)}> {cat} </Button>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <ScrollArea className="h-[70vh] w-auto whitespace-nowrap">
                <div className="grid grid-cols-2 gap-4">
                    {menu_items.filter((menu_item) => selectedCategory === undefined || menu_item.category === selectedCategory).map((menu_item) => (
                        <Dialog key={menu_item.id}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="flex-col justify-evenly w-[45vw] h-[30vh]">
                                    <h2 className="text-xl text-wrap text-left">{menu_item.name}</h2>
                                    <h2 className="text-xl text-wrap text-left">${menu_item.price}</h2>
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
                                        <Button variant="default" onClick={() => onAddToCart(menu_item)}>Add to Cart</Button>
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