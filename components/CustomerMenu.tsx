"use client";

import MenuNavBar from "@/components/MenuNavBar";
import CustomerMenuDesktop from "@/components/CustomerMenuDesktop";
import CustomerMenuMobile from "@/components/CustomerMenuMobile";
import { Menu_Item } from "@prisma/client";

import { useState } from "react";

export default function CustomerMenu({ menu_items, categories, username, is_manager}: { menu_items: Menu_Item[], categories: string[], username: string | undefined, is_manager: boolean | undefined}) {
    // make a state for cart
    const [cart, setCart] = useState<Menu_Item[]>([]);
    
    return (
        <>
            <MenuNavBar username={username} is_manager={is_manager} cart={cart} setCart={setCart}/>
            <CustomerMenuDesktop menu_items={menu_items} categories={categories} setCart={setCart} />
            <CustomerMenuMobile menu_items={menu_items} categories={categories} setCart={setCart} />
        </>
    );
}