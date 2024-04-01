"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Menu_Item, Ingredient, Menus_Ingredients, Users } from "@prisma/client";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

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



export default function ManagerFunctions({ menu_items, categories, ingredients, menuIngredients, users }: { menu_items: Menu_Item[], categories: string[], ingredients: Ingredient[], menuIngredients: Menus_Ingredients[], users: Users[]}) {
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined); 
    const [showEditDiv, setShowEditDiv] = useState(false);
    const [showTrendDiv, setShowTrendDiv] = useState(false);
    const [showEmployeeDiv, setShowEmployeeDiv] = useState(false);
    const [date, setDate] = useState<Date>();
    const router = useRouter();

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

    const addItem = () => {

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
            <ScrollArea className="h-[92vh] w-[90vw] p-8 whitespace-nowrap">
                <div className="grid grid-cols-1 gap-4 p-4">
                <Dialog>
                    <DialogTrigger className="justify-evenly">
                        <Button variant="default" className="text-lg font-bold">Add Item</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold">Add New Item</DialogTitle>
                        </DialogHeader>
                        <div>
                        <div className="p-2">
                        <Label htmlFor="message">Enter Item Name</Label>
                            <Textarea className="w-64 h-2 p-2" placeholder="Type item name here." id="message" />
                            <Label htmlFor="message">Enter Catagory</Label>
                            <Textarea className="w-64 h-2 p-2" placeholder="Type item catagory here." id="message" />
                        </div>
                        <div className="p-2">
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
                                  {date ? format(date, "PPP") : <span>Seasonal Item End Date</span>}
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
                            <ScrollArea className="h-[40vh] w-100 p-2 whitespace-nowrap">
                                <div className="flex-col space-y-4">
                                {ingredients.map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <Checkbox/>
                                            <label className="p-2">{item.name}</label>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                        <div>
                            <DialogClose asChild>
                                <Button variant="default" onClick={() => addItem}>Add Item</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button variant={"destructive"} >Cancel</Button>
                            </DialogClose>
                        </div>
                        <DialogFooter>
                            
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
            
            {/* Employee management */}
            {showEmployeeDiv && (
                <UsersList users={ users }/>
            )}
        </div>
    );
}
