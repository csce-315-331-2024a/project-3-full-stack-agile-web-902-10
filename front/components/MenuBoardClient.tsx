"use client";

import { prisma } from "@/lib/db";
import { Menu_Item } from "@prisma/client";

import { useState } from "react";
import { useEffect } from "react";



export default function MenuBoardClient({ temperature, condition}://categories1}:
    {
        temperature: number,
        condition: string
    }) {

    const categories = ["Cat1", "Cat2", "CatTest1" , "CatTest2", "CatTest3" , "CatTest4",  "Cat3","Cat4", "Cat5"];
    const l1 = [6, 13, 9, 1, 1, 9, 15, 7, 10];
    
    const l1_size = () => {
        let total = 0;
        for(let i = 0; i < l1.length; ++i){
            total += l1[i];

        }
        return total;
    }

    const l1Size = l1_size();


    const getMenuItems = ({cat, x}: {cat: string, x: number}) => {
        let menuItems = [""];
        for (let i = 0; i < x; ++i){//x; ++i){

            menuItems.push( cat + " Item: "+  i);
        }
        menuItems.splice(0,1);
        return menuItems;
    }
    const getMenuImages = ({cat, x}: {cat: string, x: number})  => {
        let menuItemsImages = [""];
        for (let i = 0; i < x; ++i){
            menuItemsImages.push(cat + " Image: "+  i );
        }
        menuItemsImages.splice(0,1);
        return menuItemsImages;
    }





    /*const menuItemToString = (item: Menu_Item) => {
        return item.name + ": $"+ item.price.toString();
    }*/

    //let temperature = 79;//temporary until weather is implimented
    let temperature_threshold = 80;//at what temperature do we switch between hot and cold items


    //to get all menu items in a recognizable way
    /*let allMenuItems = [""];
    allMenuItems.splice(0,1);
    let allMenuItemsImg = [""];
    allMenuItemsImg.splice(0,1);
    for (let i = 0; i < menu_items.length; ++i){
        allMenuItems.push(menuItemToString(menu_items[i]));
        allMenuItemsImg.push(menu_items[i].image_url);
    }*/
    
    const coldw_cat = ["Cat1"];
    const hotw_cat = ["Cat2"];

    
    let coldw_items = [""];
    coldw_items.splice(0,1);
    let coldw_itemsImg = [""];
    coldw_itemsImg.splice(0,1);
    let hotw_items = [""];
    hotw_items.splice(0,1);
    let hotw_itemsImg = [""];
    hotw_itemsImg.splice(0,1);

    for (let x = 0; x < coldw_cat.length; ++x){
        for(let i = 0; i < categories.length; ++i){
            if(categories[i] == coldw_cat[x]){
                coldw_items = getMenuItems({cat: categories[i], x: l1[i]});
                coldw_itemsImg = getMenuImages({cat: categories[i], x: l1[i]});
            }
        }
    }

    for (let x = 0; x < hotw_cat.length; ++x){
        for(let i = 0; i < categories.length; ++i){
            if(categories[i] == hotw_cat[x]){
                hotw_items = getMenuItems({cat: categories[i], x: l1[i]});
                hotw_itemsImg = getMenuImages({cat: categories[i], x: l1[i]});
            }
        }
    }

    let weather_items = [[""]];
    weather_items.splice(0,1);
    let weather_itemsImg = [[""]];
    weather_itemsImg.splice(0,1);

    weather_items.push(coldw_items);
    weather_items.push(hotw_items);
    weather_itemsImg.push(coldw_itemsImg);
    weather_itemsImg.push(hotw_itemsImg);


    

    
    //Gets menu items in a category
    /*const getMenuItems = (cat: string) => {
        let menuItems = [""];
        for (let i = 0; i < menu_items.length; ++i){
            if (menu_items[i].category == cat){
                menuItems.push(menuItemToString(menu_items[i]));
            }
        }
        menuItems.splice(0,1);
        return menuItems;
    }*/
    //gets menu item images
    /*const getMenuImages = (cat: string) => {
        let menuItemsImages = [""];
        for (let i = 0; i < menu_items.length; ++i){
            if (menu_items[i].category == cat){
                menuItemsImages.push(menu_items[i].image_url);
            }
        }
        menuItemsImages.splice(0,1);
        return menuItemsImages;
    }*/
    
    
    


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
        temp1 = getMenuItems({cat: categories[i], x: l1[i]});
        temp3 = getMenuImages({cat: categories[i], x: l1[i]});
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
        temp2 = getMenuItems({cat: categories[i], x: l1[i]});
        temp4 = getMenuImages({cat: categories[i], x: l1[i]});
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
    const [imgIndex12, setimgIndex12] = useState(0);
    const [imgIndex22, setimgIndex22] = useState(0);

    let x = 0;
    if (temperature >= temperature_threshold){//if hot
        x = 1;
    }
    const [hotCold, setHotCold] = useState(weather_items[x]);
    const [hotColdImg, setHotColdImg] = useState(weather_itemsImg[x]);
    const [weatherIndex, setWIndex] = useState(0);

    const [m1_start, setm1_start] = useState(0);
    const [m2_start, setm2_start] = useState(0);

    const [m1_next, setm1_next] = useState(0);
    const [m2_next, setm2_next] = useState(0);

    const [m1_fin, setm1_fin] = useState(false);
    const [m2_fin, setm2_fin] = useState(false);




    //function that updates the menu board
    useEffect(() => {
        const scroll = () => {
            let next1 = (index1 + 1)%preCategories1.length ;
            let next2 = (index2 + 1)%preCategories2.length ;
            //let next11 = next1;
            //let next21 = next2;

            //for cycling
            let m1s = m1_start;
            let m2s = m2_start;

            let m1n = m1_next;
            let m2n = m2_next;

            let m1f = m1_fin;
            let m2f = m2_fin;

            //let m1t = m1_start;
            //let m2t = m2_start;




            if ((preCategories2[next2] != preCategories2[index2])){//stall index 2 (added for if odd, stall till index 1 is done)
                m2n = next2;
                m2f = true;
                next2 = m2s;
            }

            if (preCategories1[next1] != preCategories1[index1]){//stall index 1
                m1n = next1;
                m1f = true;
                next1 = m1s;
            }

            if(m1f && m2f){
                m1f = false;
                m1s = m1n;
                next1 = m1n;

                if(m2n == 0 && m1n != 0){
                    next2 = m2s;
                    
                }
                else{ 
                    m2f = false;
                    m2s = m2n;
                    next2 = m2n;
                    
                }
            }


            //set state of all the looping functions
            setm1_start(m1s);
            setm2_start(m2s);
            setm1_fin(m1f);
            setm2_fin(m2f);
            setm1_next(m1n);
            setm2_next(m2n);

            //next1 = next11;
            //next2 = next21;

            setIndex1(next1);
            setIndex2(next2);
            setCurrentCat1(preCategories1[next1]);
            setCurrentMI1(preMenu1[next1]);
            setCurrentMImg1(preMenuImages1[next1]);
            setCurrentCat2(preCategories2[next2]);
            setCurrentMI2(preMenu2[next2]);
            setCurrentMImg2(preMenuImages2[next2]);

            let img1_temp = Math.floor(Math.random() * (preMenu1[next1].length));
            let img2_temp = Math.floor(Math.random() * (preMenu2[next2].length));


            setimgIndex1(img1_temp);
            setimgIndex2(img2_temp);

            let img12_temp = Math.floor(Math.random() * (preMenu1[next1].length));
            let img22_temp = Math.floor(Math.random() * (preMenu2[next2].length));

           if(img1_temp == img12_temp){
                img12_temp = (img1_temp+1)%(preMenu1[next1].length);
            }
            if(img2_temp == img22_temp){
                img22_temp = (img2_temp+1)%(preMenu2[next2].length);
            }

            setimgIndex12(img12_temp);
            setimgIndex22((img22_temp));



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
        <body className=" bg-neutral-950">


        <div className="flex justify-between content-center items-center" style={{ height: '100vh' }}>
            <div className="w-1/4 p-0 flex flex-col justify-center">
                <div className="h-1/3flex flex-col justify-center p-2" >
                    <div className="border-2 border-amber-300 p-2 m-4 flex flex-col justify-center items-center text-center object-cover rounded-3xl bg-red-950">
                        <h1 className=" text-white text-xl"> Weather:<br></br>Temperature: {temperature}°f<br></br>Condition: {condition}</h1>
                        
                    </div>
                </div>
                <div className="h-1/3 p-2" >
                        <div className="border-2 border-amber-300 p-2 m-4 flex flex-col justify-center text-center items-center object-cover rounded-3xl bg-red-950">
                            <h1 className=" text-white text-xl">{currentMenuItems1[imgIndex1]}</h1>
                            
                            <div className="aspect-[1/1] h-[200px] w-[200px] object-cover rounded-3xl border content-center">
                                <p className=" text-white text-xl text-center"> {currentMenuItemImages1[imgIndex1]} </p>
                            </div>
                    </div>
                </div>
                <div className="h-1/3 p-2" >
                        <div className="border-2 border-amber-300 p-2 m-4 flex flex-col justify-center text-center items-center object-cover rounded-3xl bg-red-950">
                            <h1 className=" text-white text-xl">{currentMenuItems1[imgIndex12]}</h1>
                            <div className="aspect-[1/1] h-[200px] w-[200px] object-cover rounded-3xl border content-center">
                                <p className=" text-white text-xl text-center"> {currentMenuItemImages1[imgIndex12]} </p>
                            </div>
                    </div>
                </div>
            </div>
            <div className="w-1/4 p-0 flex flex-col justify-center">
                <div className="border-2 border-amber-300 p-4 m-4 flex flex-col justify-start items-center text-center object-cover rounded-3xl bg-red-950" style={{ height: '85vh' }}>
                    <h1 className=" text-white font-black text-4xl">{currentCategory1}</h1>
                    <br/>
                    {currentMenuItems1.map((mi) => (
                        <p key={mi} className=" text-white text-xl"><br></br>{mi} <br></br> <br></br></p> 
                    ))}
                </div>
            </div>
            <div className="w-1/4 p-0 flex flex-col justify-center">
                <div className="border-2 border-amber-300 p-4 m-4 flex flex-col justify-start items-center text-center object-cover rounded-3xl bg-red-950" style={{ height: '85vh' }}>
                    <h1 className=" text-white font-black text-4xl">{currentCategory2}</h1>
                    <br/>
                    {currentMenuItems2.map((mi) => (
                        
                        <p  key={mi} className=" text-white text-xl"> <br></br> {mi} <br></br> <br></br></p> 
                    ))}
                </div>
            </div>
            <div className="w-1/4 p-2 flex flex-col justify-end">
                <div className="h-1/3 p-2 flex flex-col justify-end">
                    <div className="border-2 border-amber-300 p-2 m-4 flex flex-col justify-center text-center items-center object-cover rounded-3xl bg-red-950">
                        <h1 className=" text-white text-xl"> Recomended Item:<br></br> {hotCold[weatherIndex]}</h1>
                        <div className="aspect-[1/1] h-[200px] w-[200px] object-cover rounded-3xl border content-center">
                                <p className=" text-white text-xl text-center"> {hotColdImg[weatherIndex]} </p>
                        </div>
                    </div>
                </div>
                <div className="h-1/3 p-2">
                    <div className="border-2 border-amber-300 p-2 m-4 flex flex-col justify-center text-center items-center object-cover rounded-3xl bg-red-950">
                        <h1 className=" text-white text-xl">{currentMenuItems2[imgIndex2]}</h1>
                        <div className="aspect-[1/1] h-[200px] w-[200px] object-cover rounded-3xl border content-center">
                                <p className=" text-white text-xl text-center"> {currentMenuItemImages2[imgIndex2]} </p>
                        </div>
                    </div>
                </div>
                <div className="h-1/3 p-2">
                    <div className="border-2 border-amber-300 p-2 m-4 flex flex-col justify-center text-center items-center object-cover rounded-3xl bg-red-950">
                        <h1 className=" text-white text-xl">{currentMenuItems2[imgIndex22]}</h1>
                        <div className="aspect-[1/1] h-[200px] w-[200px] object-cover rounded-3xl border content-center">
                                <p className=" text-white text-xl text-center"> {currentMenuItemImages2[imgIndex22]} </p>
                        </div>
                    </div>
                </div>
                
            </div>

        </div>
        </body>
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
