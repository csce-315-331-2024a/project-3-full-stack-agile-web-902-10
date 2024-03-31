"use client";

import { prisma } from "@/lib/db";
import { Menu_Item } from "@prisma/client";

import { useState } from "react";
import { useEffect } from "react";


export default function MenuBoardClient({ menu_items, categories}:
    {
        menu_items: Menu_Item[],
        categories: string[]
    }) {
    
    const getMenuItems = (cat: string) => {
        let menuItems = [": "];
        for (let i = 0; i < menu_items.length; ++i){
            if (menu_items[i].category == cat){
                menuItems.push(menu_items[i].name);
                menuItems.push(" ");
                menuItems.push("$"+menu_items[i].price.toString());
                menuItems.push(" | ");
            }
        }
        return menuItems;
    }


    const [index, setIndex] = useState(0);
    const [currentCategory, setCurrentCat] = useState(categories[0]);
    const [currentMenuItems, setCurrentMI] = useState(getMenuItems(categories[0]));

    const [currentCategory2, setCurrentCat2] = useState(categories[1]);
    const [currentMenuItems2, setCurrentMI2] = useState(getMenuItems(categories[1]));



    useEffect(() => {
    const switchString = () => {
        const next = (index + 1) % categories.length;
        setIndex(next);
        setCurrentCat(categories[next]);
        setCurrentMI(getMenuItems(categories[next]));
        setCurrentCat2(categories[next+1]);
        setCurrentMI2(getMenuItems(categories[next+1]));
    };

    const intervalId = setInterval(switchString, 5000); 

    return () => clearInterval(intervalId);
    }, [index]); 
    
    
    return (
        <div>
        
        
        <p> {currentCategory}  {currentMenuItems}</p>
        <p> {currentCategory2}  {currentMenuItems2}</p>
        
        
        </div>
    );
}
