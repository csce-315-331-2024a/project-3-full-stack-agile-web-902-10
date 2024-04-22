"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Menu_Item } from "@prisma/client"
import { useEffect, useState } from "react";
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
import { useCartStore } from "@/lib/provider/cart-store-provider";
import { useSocket } from "@/lib/socket";

export default function CashierMenuDesktop({ menu_items_init }: { menu_items_init: Menu_Item[] }) {
    // make a state for the selected category
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [menu_items, setMenuItems] = useState<Menu_Item[]>(menu_items_init);

    const socket = useSocket();
    useEffect(() => {
        if (socket) {
            socket.emit("menuItem:read", undefined, (new_menu_items: Menu_Item[]) => {
                setMenuItems(new_menu_items);
            });
            socket.on("menuItem", (new_menu_items: Menu_Item[]) => {
                setMenuItems(new_menu_items);
            });
        }
    }, [socket]);

    return (
        <div className="hidden lg:flex flex-row">
            <ScrollArea className="h-[92vh] w-auto p-10  whitespace-nowrap">
                <div className="flex flex-col w-[10vw] space-y-8 justify-center items-center">
                    <h1 className="text-lg font-bold"> Cart Item Total </h1>
                    <Separator />
                    <Separator />
                    <p> 0 items </p>
                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>
            <ScrollArea className="h-[92vh] w-[90vw] p-8 whitespace-nowrap">
                <div className="grid grid-cols-3 gap-4">
                    {menu_items.filter((menu_item) => selectedCategory === undefined || menu_item.category === selectedCategory).map((menu_item) => (
                        <Dialog key={menu_item.id}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="flex-col justify-evenly w-[25vw] h-[8vh]">
                                    <p className="text-2xl font-bold">{menu_item.name}</p>
                                    <h2 className="text-2xl">${menu_item.price}</h2>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{menu_item.name}</DialogTitle>
                                    <DialogDescription>${menu_item.price}</DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="default">Add to Cart</Button>
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
