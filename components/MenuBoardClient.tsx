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
        let menuItems = [""];
        for (let i = 0; i < menu_items.length; ++i){
            if (menu_items[i].category == cat){
                menuItems.push(" | " + menu_items[i].name + ": $"+menu_items[i].price.toString() + " | ");
            }
        }
        menuItems.splice(0,1);
        return menuItems;
    }

    /*const firstFive = (strAr: string[]) => {
        let outAr = [""];
        for (let i = 0; i < 5; ++i){
            if(i < strAr.length){
                outAr.push(strAr[i]);
            }
        }
        outAr.splice(0,1);
        return outAr;
    }
    const removeFirstFive = (strAr: string[]) => {
        strAr.splice(0,5)
        return strAr;
    }*/
    


    const [index, setIndex] = useState(0);
    //const [count, setCount] = useState(0);

    //let preCat1 = categories[0];
    //let preMenuItems1 = getMenuItems(categories[0]);


    //const [preMenuItems1, spreMenuItems1] = useState(getMenuItems(categories[0]));


    //let preCat2 = categories[1];
    //let preMenuItems2 = getMenuItems(categories[1]);


    //const [preMenuItems2, spreMenuItems2] = useState(getMenuItems(categories[1]));

    const [currentCategory1, setCurrentCat1] = useState(categories[0]);
    const [currentMenuItems1, setCurrentMI1] = useState(getMenuItems(categories[0]));//useState(firstFive(preMenuItems1));

    const [currentCategory2, setCurrentCat2] = useState(categories[1]);
    const [currentMenuItems2, setCurrentMI2] = useState(getMenuItems(categories[1]));//useState(firstFive(preMenuItems2));




    useEffect(() => {
        const switchString = () => {
            /*if (preMenuItems1.length <=5 && preMenuItems2.length <=5){
                setCount(count + 1);
                const next = (index + 2);
                setIndex(next%categories.length);

                setCurrentCat1(categories[(next-1)%categories.length]);
                spreMenuItems1(getMenuItems(currentCategory1));
                setCurrentMI1(firstFive(preMenuItems1));

                setCurrentCat2(categories[next%categories.length]);
                spreMenuItems2(getMenuItems(currentCategory2));
                setCurrentMI2(firstFive(preMenuItems2));
            }
            else if (preMenuItems1.length >5 && preMenuItems2.length >5){
                setCount(count + 1);
                //setIndex(index);
                //setCurrentCat1(categories[(index-1)%categories.length])
                spreMenuItems1(removeFirstFive(preMenuItems1));
                setCurrentMI1(firstFive(preMenuItems1));
                //setCurrentCat2(categories[index%categories.length]);
                spreMenuItems2(removeFirstFive(preMenuItems2));
                setCurrentMI2(firstFive(preMenuItems2));

                //setCurrentCat1(categories[(index-1)%categories.length]);
                //setCurrentCat2(categories[(index)%categories.length]);
            }
            else if (preMenuItems1.length > 5 && preMenuItems2.length <= 5){
                setCount(count + 1);
                //setIndex(index);
                spreMenuItems1(removeFirstFive(preMenuItems1));
                setCurrentMI1(firstFive(preMenuItems1));
                //setCurrentCat1(categories[(index-1)%categories.length]);
                //setCurrentCat2(categories[index%categories.length]);
                setCurrentMI2(currentMenuItems2);
                //setCurrentCat1(categories[(index-1)%categories.length]);
                //setCurrentCat2(categories[(index)%categories.length]);
            }
            else{//if 1 is below and 2 is over
                setCount(count + 1);
                //setIndex(index);
                spreMenuItems2(removeFirstFive(preMenuItems2));
                setCurrentMI2(firstFive(preMenuItems2));
                //setCurrentCat1(categories[(index-1)%categories.length]);
                //setCurrentCat2(categories[index%categories.length]);
                //setCurrentMI1(currentMenuItems1);
                //setCurrentCat1(categories[(index-1)%categories.length]);
                //setCurrentCat2(categories[(index)%categories.length]);
            }*/


            const next = (index + 2) ;
            setIndex(next% categories.length);
            setCurrentCat1(categories[(next-1)% categories.length]);
            setCurrentMI1(getMenuItems(categories[(next-1)% categories.length]));
            setCurrentCat2(categories[(next)% categories.length]);
            setCurrentMI2(getMenuItems(categories[(next)% categories.length]));
        };

        const intervalId = setInterval(switchString, 5000); 

        return () => clearInterval(intervalId);
    }, [index]);//, count, currentCategory1, currentCategory2, currentMenuItems1, currentCategory2]); 
    
    
    return (
        <div>
        
        
        <p> {currentCategory1}  {currentMenuItems1}</p>
        <p> {currentCategory2}  {currentMenuItems2}</p>
        
        
        </div>
    );
}
