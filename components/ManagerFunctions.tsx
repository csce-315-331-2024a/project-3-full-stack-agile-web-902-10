"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { Menu_Item, Ingredient, Menus_Ingredients } from "@prisma/client"
import { useState } from "react";
import { prisma } from '@/lib/db';
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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@radix-ui/react-checkbox";


export default function ManagerFunctions({ menu_items, categories, ingredients, menuIngredients }: { menu_items: Menu_Item[], categories: string[], ingredients: Ingredient[], menuIngredients: Menus_Ingredients[]}) {
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined); 
    const [showEditDiv, setShowEditDiv] = useState(false);

    const toggleEditMenuDiv = () => {
        setShowEditDiv(!showEditDiv);
    };

    const editItem = (menu_item: Menu_Item) => {

    }

    const addItem = () => {

    }

    return (
        <div className="hidden lg:flex flex-row">
            {/* Manager Options */}
            <ScrollArea className="h-[92vh] w-auto p-10  whitespace-nowrap">
                <div className="flex flex-col w-[10vw] space-y-8 justify-center items-center">
                    <p className="text-lg font-bold"> Options </p>
                    <Separator />
                    
                    <Button variant={"secondary"} onClick={toggleEditMenuDiv}>Edit Menu</Button>
                </div>
            </ScrollArea>
            {/* if editing menu items */}
            {showEditDiv && (
            <ScrollArea className="h-[92vh] w-[90vw] p-8 whitespace-nowrap">
                <div className="grid grid-cols-1 gap-4 p-4">
                <Dialog>
                    <DialogTrigger className="justify-evenly">
                        <Button variant="default" className="text-lg font-bold">Add Items</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Item</DialogTitle>
                        </DialogHeader>
                        <div>
                            <ScrollArea className="h-[40vh] w-[90vw] p-8 whitespace-nowrap">
                                <div className="flex-col space-y-4">
                                {ingredients.map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <Checkbox/>
                                            <label>{item.name}</label>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="default" onClick={() => addItem}>Add Item</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button variant={"destructive"} >Cancel</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Separator />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                    {menu_items.filter((menu_item) => selectedCategory === undefined || menu_item.category === selectedCategory).map((menu_item) => (
                        <Dialog key={menu_item.id}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="flex-col justify-evenly w-[25vw] h-[10vh]">
                                    <p className="text-2xl font-bold">{menu_item.name}</p>
                                    <h2 className="text-2xl">${menu_item.price}</h2>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{menu_item.name}</DialogTitle>
                                    <DialogDescription>${menu_item.price}</DialogDescription>
                                </DialogHeader>
                                <div className="flex-col space-y-4">
                                    {/* {menuIngredients.map((menuIngredient, index) => (
                                        <div key={index} className="flex items-center">
                                            <p>{.name}</p>
                                        </div>
                                    ))} */}
                                </div>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="default" onClick={() => editItem(menu_item)}>Edit Item</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button variant={"destructive"} >Cancel</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            </ScrollArea>
            )}
        </div>
    );
}
