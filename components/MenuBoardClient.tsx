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
    


    const [index, setIndex] = useState(0);
    const [currentCategory, setCurrentCat] = useState(categories[0]);
    //const [currentMenuItems, setCurrentMI] = useState([0]);



    useEffect(() => {
    const switchString = () => {
        const next = (index + 1) % categories.length;
        setIndex(next);
        setCurrentCat(categories[next]);
    };

    const intervalId = setInterval(switchString, 5000); 

    return () => clearInterval(intervalId);
    }, [index]); 


        
    /*let i = 0;
    const [j, setj] = useState<string | undefined>(undefined);
    

    const timeout = () => {
        const timeout_clear = setTimeout(loop, 5000);
        return () =>  clearTimeout(timeout_clear);
    }

    const loop = () => {
        if (j == "whats up"){
            setj("what");
        }
        else {
            setj("whats up");
        }
    };*/
    
    
    return (
        <div>
        
        
        <p> {currentCategory}</p>
        
        
        </div>
        
    
        /*<div> 
        {menu_items.filter((menu_item) => menu_item.name === categories[0]).map((menu_item) => (
            <h2 className="text-xl text-wrap text-left">{menu_item.category}  </h2>
        ))}
        </div> */
    );
}
