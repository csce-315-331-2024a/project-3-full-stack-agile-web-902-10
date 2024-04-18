"use client";

import { prisma } from "@/lib/db";
import { Menu_Item } from "@prisma/client";

import { useState } from "react";
import { useEffect } from "react";



export default function MenuBoardClient({ menu_items, categories, temperature, condition}://categories1}:
    {
        menu_items: Menu_Item[],
        categories: string[],
        temperature: number,
        condition: string
    }) {
    const menuItemToString = (item: Menu_Item) => {
        return item.name + ": $"+ item.price.toString();
    }

    //let temperature = 79;//temporary until weather is implimented
    let temperature_threshold = 80;//at what temperature do we switch between hot and cold items


    //to get all menu items in a recognizable way
    let allMenuItems = [""];
    allMenuItems.splice(0,1);
    let allMenuItemsImg = [""];
    allMenuItemsImg.splice(0,1);
    for (let i = 0; i < menu_items.length; ++i){
        allMenuItems.push(menuItemToString(menu_items[i]));
        allMenuItemsImg.push(menu_items[i].image_url);
    }
    
    const coldw_cat = ["burger", "Burger"];
    const hotw_cat = ["shake", "Shake"];

    let weather_items = [[""]];
    weather_items.splice(0,1);
    let weather_itemsImg = [[""]];
    weather_itemsImg.splice(0,1);
    let coldw_items = [""];
    coldw_items.splice(0,1);
    let coldw_itemsImg = [""];
    coldw_itemsImg.splice(0,1);
    let hotw_items = [""];
    hotw_items.splice(0,1);
    let hotw_itemsImg = [""];
    hotw_itemsImg.splice(0,1);

    for(let x = 0; x < coldw_cat.length; ++x){
        for (let y = 0; y < menu_items.length; ++y){
            if (menu_items[y].name.search(coldw_cat[x]) != -1){
                coldw_items.push(menuItemToString(menu_items[y]));
                coldw_itemsImg.push(menu_items[y].image_url);
            }
        }
    }
    for(let x = 0; x < hotw_cat.length; ++x){
        for (let y = 0; y < menu_items.length; ++y){
            if (menu_items[y].name.search(hotw_cat[x]) != -1){
                hotw_items.push(menuItemToString(menu_items[y]));
                hotw_itemsImg.push(menu_items[y].image_url);
            }
        }
    }

    if (coldw_items.length == 0){
        weather_items.push(allMenuItems);
        weather_itemsImg.push(allMenuItemsImg);
    }
    else {
        weather_items.push(coldw_items);
        weather_itemsImg.push(coldw_itemsImg);
    }

    if (hotw_items.length == 0){
        weather_items.push(allMenuItems);
        weather_itemsImg.push(allMenuItemsImg);
    }
    else {
        weather_items.push(hotw_items);
        weather_itemsImg.push(hotw_itemsImg);
    }


    

    
    //Gets menu items in a category
    const getMenuItems = (cat: string) => {
        let menuItems = [""];
        for (let i = 0; i < menu_items.length; ++i){
            if (menu_items[i].category == cat){
                menuItems.push(menuItemToString(menu_items[i]));
            }
        }
        menuItems.splice(0,1);
        return menuItems;
    }
    //gets menu item images
    const getMenuImages = (cat: string) => {
        let menuItemsImages = [""];
        for (let i = 0; i < menu_items.length; ++i){
            if (menu_items[i].category == cat){
                menuItemsImages.push(menu_items[i].image_url);
            }
        }
        menuItemsImages.splice(0,1);
        return menuItemsImages;
    }
    /*
    const getMenuItems = ({cat, x}: {cat: string, x: number}) => {
        let menuItems = [""];
        for (let i = 0; i < x; ++i){//x; ++i){

            menuItems.push("| TEST" +  i +" |");
        }
        menuItems.splice(0,1);
        return menuItems;
    }
    const categories = ["Cat1", "Cat2", "Cat3","Cat4", "Cat5",];
    const l1 = [6, 13, 15, 7, 10];*/


    //definitions for arrays
    let preMenu1 = [[""]];
    preMenu1.splice(0,1);
    let temp1 = [""];
    temp1.splice(0,1);

    let preMenu2 = [[""]];
    preMenu2.splice(0,1);
    let temp2 = [""];
    temp2.splice(0,1);

    let preMenuImages1 = [[""]];
    preMenuImages1.splice(0,1);
    let temp3 = [""];
    temp3.splice(0,1);

    let preMenuImages2 = [[""]];
    preMenuImages2.splice(0,1);
    let temp4 = [""];
    temp4.splice(0,1);

    let preCategories1 = [""];
    preCategories1.splice(0,1);
    let preCategories2 = [""];
    preCategories2.splice(0,1);


    //gets all the elements for the first half of the menu board
    for (let i = 0; i < categories.length; i = i +2){
        //temp1 = getMenuItems({cat: categories[i], x: l1[i]});
        temp1 = getMenuItems(categories[i]);
        temp3 = getMenuImages(categories[i]);
        while (temp1.length > 5){  
            preMenu1.push(temp1.splice(0,5));
            preMenuImages1.push(temp3.splice(0,5));
            preCategories1.push(categories[i]);
        }   
        preMenu1.push(temp1);
        preMenuImages1.push(temp3);
        preCategories1.push(categories[i]);
     }
     //gets all the elements for the second half of the menu board
     for (let i = 1; i < categories.length; i = i +2){
        //temp2 = getMenuItems({cat: categories[i], x: l1[i]});
        temp2 = getMenuItems(categories[i]);
        temp4 = getMenuImages(categories[i]);
        while (temp2.length > 5){  
            preMenu2.push(temp2.splice(0,5));
            preMenuImages2.push(temp4.splice(0,5));
            preCategories2.push(categories[i]);
        }   
        preMenu2.push(temp2);
        preMenuImages2.push(temp4);
        preCategories2.push(categories[i]);
     }

    


     //states that are changing
    const [index1, setIndex1] = useState(0);
    const [index2, setIndex2] = useState(0);


    const [currentCategory1, setCurrentCat1] = useState(preCategories1[0]);
    const [currentMenuItems1, setCurrentMI1] = useState(preMenu1[0]);
    const [currentMenuItemImages1, setCurrentMImg1] = useState(preMenuImages1[0]);

    const [currentCategory2, setCurrentCat2] = useState(preCategories2[0]);
    const [currentMenuItems2, setCurrentMI2] = useState(preMenu2[0]);
    const [currentMenuItemImages2, setCurrentMImg2] = useState(preMenuImages2[0]);

    const [imgIndex1, setimgIndex1] = useState(0);
    const [imgIndex2, setimgIndex2] = useState(0);

    let x = 0;
    if (temperature >= temperature_threshold){//if hot
        x = 1;
    }
    const [hotCold, setHotCold] = useState(weather_items[x]);
    const [hotColdImg, setHotColdImg] = useState(weather_itemsImg[x]);
    const [weatherIndex, setWIndex] = useState(0);




    //function that updates the menu board
    useEffect(() => {
        const scroll = () => {
            let next1 = (index1 + 1)%preCategories1.length ;
            let next2 = (index2 + 1)%preCategories2.length ;
            let next11 = next1;
            let next21 = next2;

            if ((preCategories1[next1] == preCategories1[index1] && preCategories2[next2] != preCategories2[index2]) || (next2 == 0 && next1 != 0)){//stall index 2 (added for if odd, stall till index 1 is done)
                next21 = index2;
            }

            if (preCategories2[next2] == preCategories2[index2] && preCategories1[next1] != preCategories1[index1]){//stall index 1
                next11 = index1;
            }
            next1 = next11;
            next2 = next21;

            setIndex1(next1);
            setIndex2(next2);
            setCurrentCat1(preCategories1[next1]);
            setCurrentMI1(preMenu1[next1]);
            setCurrentMImg1(preMenuImages1[next1]);
            setCurrentCat2(preCategories2[next2]);
            setCurrentMI2(preMenu2[next2]);
            setCurrentMImg2(preMenuImages2[next2]);

            setimgIndex1(Math.floor(Math.random() * (preMenu1[next1].length)));
            setimgIndex2(Math.floor(Math.random() * (preMenu2[next2].length)));


            if (temperature >= temperature_threshold){//if hot
                x = 1;
            }
            else{
                x = 0;
            }

            setHotCold(weather_items[x]);
            setHotColdImg(weather_itemsImg[x]);
            setWIndex(Math.floor(Math.random() * (weather_items[x].length)));
        };

        const intervalId = setInterval(scroll, 5000); 

        return () => clearInterval(intervalId);
    }, [index1, index2]);
    
    //output
    return (
        <div className="flex justify-between" >
            <div className="w-1/4 p-2 flex flex-col justify-end">
                <div className="h-1/2 p-2 flex flex-col justify-end">
                    <div className="border-2 border-black p-2 m-4 flex flex-col justify-center items-center object-cover rounded-3xl">
                        <h1> Weather:</h1>
                        <h1>{temperature}</h1>
                        <h1>{condition}</h1>
                        
                    </div>
                </div>
                <div className="h-1/2 p-2">
                        <div className="border-2 border-black p-2 m-4 flex flex-col justify-center items-center object-cover rounded-3xl">
                            <h1>{currentMenuItems1[imgIndex1]}</h1>
                            <img 
                                src = {currentMenuItemImages1[imgIndex1]}
                                height={200}
                                className="aspect-[1/1] h-[200px] w-[200px] object-cover rounded-3xl border"
                            />
                    </div>
                </div>
            </div>
            <div className="w-1/4 p-2 flex flex-col justify-center">
                <div className="border-2 border-black p-4 m-4 flex flex-col justify-start items-center object-cover rounded-3xl" style={{ height: '90vh' }}>
                    <h1>{currentCategory1}</h1>
                    <br/>
                    {currentMenuItems1.map((mi) => (
                        <p key={mi}> {mi} <br></br> <br></br></p> 
                    ))}
                </div>
            </div>
            <div className="w-1/4 p-2 flex flex-col justify-end">
                <div className="border-2 border-black p-4 m-4 flex flex-col justify-start items-center object-cover rounded-3xl" style={{ height: '90vh' }}>
                    <h1>{currentCategory2}</h1>
                    <br/>
                    {currentMenuItems2.map((mi) => (
                        
                        <p key={mi}> {mi} <br></br> <br></br></p> 
                    ))}
                </div>
            </div>
            <div className="w-1/4 p-2 flex flex-col justify-end">
                <div className="h-1/2 p-2 flex flex-col justify-end">
                    <div className="border-2 border-black p-2 m-4 flex flex-col justify-center items-center object-cover rounded-3xl">
                        <h1> Recomended Item:</h1>
                        <h1>{hotCold[weatherIndex]}</h1>
                        <img 
                            src = {hotColdImg[weatherIndex]}
                            height={200}
                            className="aspect-[1/1] h-[200px] w-[200px] object-cover rounded-3xl border"
                        />
                    </div>
                </div>
                <div className="h-1/2 p-2">
                    <div className="border-2 border-black p-2 m-4 flex flex-col justify-center items-center object-cover rounded-3xl">
                        <h1>{currentMenuItems2[imgIndex2]}</h1>
                        <img 
                            src = {currentMenuItemImages2[imgIndex2]}
                            height={200}
                            className="aspect-[1/1] h-[200px] w-[200px] object-cover rounded-3xl border"
                        />
                    </div>
                </div>
                
            </div>

        </div>
    );
}
    /*
    return (
        <div>
        
        
        <p> {currentCategory1}  {currentMenuItems1}</p>
        <p> {currentCategory2}  {currentMenuItems2}</p>

        <p>Board 1 Item and Image: {currentMenuItems1[imgIndex1]}</p>
        <img 
        src = {currentMenuItemImages1[imgIndex1]}
        width={200}
        height={200}
        className="aspect-[1/1] h-[200px] w-[200px] object-cover rounded-3xl border"
        />
        <p>Board 2 Item and Image: {currentMenuItems2[imgIndex2]}</p>
        <img 
        src = {currentMenuItemImages2[imgIndex2]}
        height={200}
        className="aspect-[1/1] h-[200px] w-[200px] object-cover rounded-3xl border"
        />
        <p>Recommended Item: {hotCold[weatherIndex]}</p>
        <img 
        src = {hotColdImg[weatherIndex]}
        height={200}
        className="aspect-[1/1] h-[200px] w-[200px] object-cover rounded-3xl border"
        />
        <p> {temperature}</p>
        
        </div>
    );
}*/
