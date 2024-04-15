"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Menu_Item, Ingredient, Ingredients_Menu, Users } from "@prisma/client";
import * as React from "react";
import { useState } from "react";
import { useRouter } from 'next/navigation';

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
} from "@/components/ui/dialog";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"  

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import UsersList from "./UsersList";


export default function ManagerFunctions({ menu_items, categories, ingredients, menuIngredients, users }: { menu_items: Menu_Item[], categories: string[], ingredients: Ingredient[], menuIngredients: Ingredients_Menu[], users: Users[]}) {
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined); 
    const [showEditDiv, setShowEditDiv] = useState(false);
    const [showTrendDiv, setShowTrendDiv] = useState(false);
    const [showEmployeeDiv, setShowEmployeeDiv] = useState(false);
    const [date, setDate] = useState<Date>();
    const router = useRouter();
    const [itemName, setItemName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    let ingredientsMenuList: Ingredients_Menu[] = [];

    const toggleEditMenuDiv = () => {
        setShowEmployeeDiv(false);
        setShowTrendDiv(false);
        setShowEditDiv(!showEditDiv);
    }

    const toggleBoard = () => {
        window.open('/menu_board', '_blank');
    }

    const toggleTrends = () => {
        setShowEmployeeDiv(false);
        setShowEditDiv(false);
        setShowTrendDiv(false);
        router.push("/manager_trends");
    }

    const toggleEmployee = () => {
        setShowTrendDiv(false);
        setShowEditDiv(false);
        setShowEmployeeDiv(!showEmployeeDiv);
    }

    const editItem = (menu_item: Menu_Item) => {

    }

    const handleInputChange = (e: any, setter: any) => {
        setter(e.target.value);
    }

    const handleCheckboxAddMenu = (item: Ingredient, menu_name: string) => {
        const newLink: Ingredients_Menu = {
            id: menuIngredients[menuIngredients.length].id + 1,
            ingredients_id: item.id,
            menu_id: menu_items[menu_items.length].id + 1,
            quantity: 1,
        };
        ingredientsMenuList.push(newLink)
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formData = {
            itemName,
            category,
            price,
            ingredientsMenuList
        };
        //const result = await prisma.$queryRawUnsafe('INSERT INTO Menu_Item (name, price, image_url, category, ) VALUES (${itemName}, ${price}, https://thumbs.dreamstime.com/b/heart-shape-various-vegetables-fruits-healthy-food-concept-isolated-white-background-140287808.jpg, ${category}, ${ingredientsMenuList});');
        ingredientsMenuList = [];
    };

    async function deleteItem(menu_item: Menu_Item) {
       const result = null//await prisma.$queryRawUnsafe('DELETE FROM Menu_Item WHERE id = ${menu_item.id};');
       return result
    }

    return (
        <div className="hidden lg:flex flex-row gap-4">
            {/* Manager Options */}
            <ScrollArea className="h-[92vh] w-auto whitespace-nowrap">
                <div className="flex flex-col w-[10vw] space-y-8 m-8">
                    <p className="text-lg font-bold"> Options </p>
                    <Separator />
                    
                    <Button className="text-md font-bold w-[7vw]" variant={"secondary"} onClick={toggleEditMenuDiv}>Edit Menu</Button>
                    <Button className="text-md font-bold w-[7vw]" variant={"secondary"} onClick={toggleTrends}>Trends</Button>
                    <Button className="text-md font-bold w-[7vw]" variant={"secondary"} onClick={toggleEmployee}>Employees</Button>
                    <Button className="text-md font-bold w-[7vw]" variant={"secondary"} onClick={toggleBoard}>Menu Board</Button>

                </div>
            </ScrollArea>

            {/* if editing menu items */}
            {showEditDiv && (
            <ScrollArea className="flex-col w-auto items-center">
                <div className="grid grid-cols-1 gap-4 p-4">
                    <Dialog>
                            <div className="flex flex-col w-auto justify-center items-center">
                                <DialogTrigger>
                                    <Button variant="default" className="text-3xl font-bold p-8">Add Item</Button>
                                </DialogTrigger>
                            </div>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold">Add New Item</DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleSubmit}>
                                <div className="">
                                    <Label htmlFor="itemName">Enter Item Name</Label>
                                    <Input 
                                        className="w-64" 
                                        placeholder="Type item name here." 
                                        id="itemName" 
                                        value={itemName}
                                        onChange={(e) => handleInputChange(e, setItemName)}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="category">Enter Category</Label>
                                    <Input 
                                        className="w-64" 
                                        placeholder="Type item category here." 
                                        id="category" 
                                        value={category}
                                        onChange={(e) => handleInputChange(e, setCategory)}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="price">Enter Price</Label>
                                    <Input 
                                        className="w-64" 
                                        placeholder="Type item price here." 
                                        id="price" 
                                        value={price}
                                        onChange={(e) => handleInputChange(e, setPrice)}
                                    />
                                </div>

                                <div className="">
                                    <Label htmlFor="date">Enter Seasonal Item End Date</Label>
                                    <Popover modal={true}>
                                        <PopoverTrigger asChild>
                                            <Button
                                              variant={"outline"}
                                              className={cn(
                                                "w-[280px] justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                              )}
                                            >
                                              <CalendarIcon className="mr-2 h-4 w-4" />
                                              {date ? format(date, "PPP") : <span>Select Date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                              mode="single"
                                              selected={date}
                                              onSelect={setDate}
                                              initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                          
                                <ScrollArea className="h-[40vh] w-100 p-2 whitespace-nowrap overflow-auto border-2 rounded-lg">
                                    <div className="flex-col space-y-4">
                                        {ingredients.map((item, index) => (
                                            <div key={index} className="flex items-center">
                                                <Checkbox 
                                                    id={(item.id).toString()}
                                                    onChange={() => handleCheckboxAddMenu(item, itemName)}
                                                />
                                                <label htmlFor={(item.id).toString()} className="p-2">{item.name}</label>                                          
                                            </div>
                                            ))}
                                    </div>
                                </ScrollArea>                                    

                                <div className="flex items-center gap-4">
                                    <DialogClose asChild>
                                        <Button variant="default" type="submit">Add Item</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button variant={"destructive"} >Cancel</Button>
                                    </DialogClose>
                                </div>

                            </form>                       
                        </DialogContent>                  
                    </Dialog>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                    {menu_items.filter((menu_item) => selectedCategory === undefined || menu_item.category === selectedCategory).map((menu_item) => (
                        <Dialog key={menu_item.id}>
                        
                            <div className="flex-col w-[25vw] h-[10vh] border-solid border-2 rounded-lg">
                                <div className="flex flex-col w-[25vw] h-[10vh] justify-center items-center">
                                    <h2 className="text-base font-bold snap-center">{menu_item.name}</h2>
                                    <div className="flex justify-center items-center gap-4">
                                        <DialogTrigger asChild>
                                            <Button variant="default" onClick={() => editItem(menu_item)}>Edit Item</Button>
                                        </DialogTrigger>
                                        <AlertDialog>
                                            <AlertDialogTrigger>
                                                <Button variant="destructive">
                                                    Delete Item
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the menu item
                                                        and remove its data from our server.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <Button variant="destructive" onClick={() => deleteItem(menu_item)}>
                                                        Continue
                                                    </Button>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div> 
                                </div>
                            </div>
                            
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="text-lg font-bold">Edit Item</DialogTitle>
                                </DialogHeader>

                                <div className="">
                                    <Label htmlFor="message">Change Item Name</Label>
                                    <Input className="w-64" placeholder={menu_item.name} id="message" />
                                </div>

                                <div>
                                    <Label htmlFor="message">Change Category</Label>
                                    <Input className="w-64" placeholder={menu_item.category} id="message" />
                                </div>

                                <div>
                                    <Label htmlFor="message">Change Price</Label>
                                    <Input className="w-64" placeholder={(menu_item.price).toString()} id="message" />
                                </div>

                                <div className="">
                                    <Label htmlFor="message">Change Seasonal Item End Date</Label>
                                    <Popover modal={true}>
                                        <PopoverTrigger asChild>
                                            <Button
                                              variant={"outline"}
                                              className={cn(
                                                "w-[280px] justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                              )}
                                            >
                                              <CalendarIcon className="mr-2 h-4 w-4" />
                                              {date ? format(date, "PPP") : <span>Select Date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                              mode="single"
                                              selected={date}
                                              onSelect={setDate}
                                              initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                          
                                <ScrollArea className="h-[40vh] w-100 p-2 whitespace-nowrap overflow-auto border-2 rounded-lg">
                                    <div className="flex-col space-y-4">
                                        {ingredients.map((item, index) => (
                                            <div key={index} className="flex items-center">
                                                <Checkbox 
                                                    id={(item.id).toString()} 
                                                />
                                                <label htmlFor={(item.id).toString()} className="p-2">{item.name}</label>
                                            </div>
                                            ))}
                                    </div>
                                </ScrollArea>
                                        

                                <div className="flex items-center gap-4">
                                    <DialogClose asChild>
                                        <Button variant="default" onClick={() => editItem(menu_item)}>Edit Item</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button variant={"destructive"} >Cancel</Button>
                                    </DialogClose>
                                </div>
                                <DialogFooter>
                                        
                                </DialogFooter>                        
                            </DialogContent> 
                        </Dialog>
                    ))}
                </div>
            </ScrollArea>            
            )}
            
            {/* Employee management */}
            {showEmployeeDiv && (
                <UsersList users={ users }/>
            )}
        </div>
    );
}
