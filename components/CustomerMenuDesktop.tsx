"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { Menu_Item } from "@prisma/client"
import { useState } from "react";
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
import { Label } from "@/components/ui/label"

export default function CustomerMenuDesktop({ menu_items, categories, setCart }: { menu_items: Menu_Item[], categories: string[], setCart: any }) {
    // make a state for the selected category
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

    const onCategoryClick = (category: string) => {
        if (selectedCategory === category) {
            setSelectedCategory(undefined);
        } else {
            setSelectedCategory(category);
        }
    }

    const onAddToCart = (menu_item: Menu_Item) => {
        // maybe we should validate here?
        setCart((prevCart: Menu_Item[]) => [...prevCart, menu_item]);
    }

    return (
        <div className="hidden lg:flex flex-row">
            <ScrollArea className="h-[92vh] w-auto p-10  whitespace-nowrap">
                <div className="flex flex-col w-[10vw] space-y-8 justify-center items-center">
                    <h1 className="text-lg font-bold"> Category </h1>
                    <Separator />
                    {categories.map((cat) => (
                        <Button key={cat} variant={selectedCategory === cat ? "default" : "secondary"} className="w-[8vw] h-[5vh] text-lg font-bold" onClick={() => onCategoryClick(cat)}> {cat} </Button>
                    ))}
                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>
            <ScrollArea className="h-[92vh] w-[90vw] p-8 whitespace-nowrap">
                <div className="grid grid-cols-3 gap-4">
                    {menu_items.filter((menu_item) => selectedCategory === undefined || menu_item.category === selectedCategory).map((menu_item) => (
                        <Dialog key={menu_item.id}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="flex-col justify-evenly w-[25vw] h-[40vh]">
                                    <h2 className="text-2xl font-bold">{menu_item.name}</h2>
                                    <Image
                                        src={menu_item.image_url}
                                        width={200}
                                        height={200}
                                        alt="Photo by ..."
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
                                    alt="Photo by ..."
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
