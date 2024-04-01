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
    
    //Gets menu items in a category
    const getMenuItems = (cat: string) => {
        let menuItems = [""];
        for (let i = 0; i < menu_items.length; ++i){
            if (menu_items[i].category == cat){
                menuItems.push(" | " + menu_items[i].name + ": $"+menu_items[i].price.toString() + " | ");
            }
        }
        menuItems.splice(0,1);
        return menuItems;
    }


    //definitions for arrays
    let preMenu1 = [[""]];
    preMenu1.splice(0,1);
    let temp1 = [""];
    temp1.splice(0,1);

    let preMenu2 = [[""]];
    preMenu2.splice(0,1);
    let temp2 = [""];
    temp2.splice(0,1);

    let preCategories1 = [""];
    preCategories1.splice(0,1);
    let preCategories2 = [""];
    preCategories2.splice(0,1);


    //gets all the elements for the first half of the menu board
    for (let i = 0; i < categories.length; i = i +2){
        temp1 = getMenuItems(categories[i]);
        while (temp1.length > 5){  
            preMenu1.push(temp1.splice(0,5));
            preCategories1.push(categories[i]);
        }   
        preMenu1.push(temp1);
        preCategories1.push(categories[i]);
     }
     //gets all the elements for the second half of the menu board
     for (let i = 1; i < categories.length; i = i +2){
        temp2 = getMenuItems(categories[i]);
        while (temp2.length > 5){  
            preMenu2.push(temp2.splice(0,5));
            preCategories2.push(categories[i]);
        }   
        preMenu2.push(temp2);
        preCategories2.push(categories[i]);
     }

    


     //states that are changing
    const [index1, setIndex1] = useState(0);
    const [index2, setIndex2] = useState(0);

    const [currentCategory1, setCurrentCat1] = useState(preCategories1[0]);
    const [currentMenuItems1, setCurrentMI1] = useState(preMenu1[0]);

    const [currentCategory2, setCurrentCat2] = useState(preCategories2[0]);
    const [currentMenuItems2, setCurrentMI2] = useState(preMenu2[0]);



    //function that updates the menu board
    useEffect(() => {
        const scroll = () => {
            let next1 = (index1 + 1)%preCategories1.length ;
            let next2 = (index2 + 1)%preCategories2.length ;

            if ((preCategories1[next1] == preCategories1[index1] && preCategories2[next2] != preCategories2[index2]) || (next2 == 0 && next1 != 0)){//stall index 2 (added for if odd, stall till index 1 is done)
                next2 = index2;
            }

            if (preCategories2[next2] == preCategories1[index2] && preCategories1[next1] != preCategories1[index1]){//stall index 1
                next1 = index1;
            }

            setIndex1(next1);
            setIndex2(next2);
            setCurrentCat1(preCategories1[next1]);
            setCurrentMI1(preMenu1[next1]);
            setCurrentCat2(preCategories2[next2]);
            setCurrentMI2(preMenu2[next2]);
        };

        const intervalId = setInterval(scroll, 5000); 

        return () => clearInterval(intervalId);
    }, [index1, index2]);
    
    //output
    return (
        <div>
        
        
        <p> {currentCategory1}  {currentMenuItems1}</p>
        <p> {currentCategory2}  {currentMenuItems2}</p>
        
        
        </div>
    );
}
