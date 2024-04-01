"use client";

import { prisma } from "@/lib/db";
import { Menu_Item } from "@prisma/client";

import { useState } from "react";


export default function menu_board_client({ menu_items, categories}:
    {
        menu_items: Menu_Item[],
        categories: string[]
    }) {
    let i = 0;
    let j = "john";

    const timeout = () => {
        const timeout_clear = setTimeout(loop, 5000);
        return () =>  clearTimeout(timeout_clear);
    }

    const loop = () => {
        
        for (i = 0; i < categories.length -2;  ++i){
            timeout();
            if (j == "whats up"){
                j = "YOOOOO";
            }
            else {
                j = "whats up"
            }
                
        };
        /*const timeout_clear = setTimeout(timer, 5000);
        return () =>  clearTimeout(timeout_clear);*/
    };
    
    loop();
    
    
    
    
    return (
        <p> hello </p>
    
        /*<div> 
        {menu_items.filter((menu_item) => menu_item.name === categories[0]).map((menu_item) => (
            <h2 className="text-xl text-wrap text-left">{menu_item.category}  </h2>
        ))}
        </div> */
    );
}
