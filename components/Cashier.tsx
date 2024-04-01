"use client";

import CashierNavBar from "@/components/CashierNavBar";
import CashierMenuDesktop from "@/components/CashierMenuDesktop";
import { Menu_Item } from "@prisma/client";

import { useState } from "react";

export default function Cashier({ menu_items, categories, username, is_manager }:
    {
        menu_items: Menu_Item[],
        categories: string[],
        username: string | undefined,
        is_manager: boolean | undefined
    }) {
    // make a state for cart
    const [cart, setCart] = useState<Menu_Item[]>([]);

    return (
        <>
            <CashierNavBar username={username} is_manager={is_manager} cart={cart} setCart={setCart} />
            <CashierMenuDesktop menu_items={menu_items} categories={categories} setCart={setCart} />
        </>
    );
}