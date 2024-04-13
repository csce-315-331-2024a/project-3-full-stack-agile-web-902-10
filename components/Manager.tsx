"use client";

import ManagerNavBar from "@/components/ManagerNavBar";
import ManagerFunctions from "@/components/ManagerFunctions";
// import CustomerMenuMobile from "@/components/CustomerMenuMobile";
import { Menu_Item, Ingredient, Menus_Ingredients, Users } from "@prisma/client";
//import { useState } from "react";

export default function Manager({ menu_items, categories, username, ingredients, menuIngredients, users}:
    {
        menu_items: Menu_Item[],
        categories: string[],
        username: string | undefined,
        ingredients: Ingredient[],
        menuIngredients: Menus_Ingredients[], 
        users: Users[]
    }) {

    return (
        <>
            <ManagerNavBar username={username} />
            <ManagerFunctions menu_items={menu_items} categories={categories} ingredients={ingredients} menuIngredients={menuIngredients} users={users}/>
        </>
    );
}