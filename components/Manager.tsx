"use client";

import ManagerNavBar from "@/components/ManagerNavBar";
// import CustomerMenuDesktop from "@/components/CustomerMenuDesktop";
// import CustomerMenuMobile from "@/components/CustomerMenuMobile";
import { Menu_Item } from "@prisma/client";
//import { useState } from "react";

export default function Manager({ menu_items, categories, username }:
    {
        menu_items: Menu_Item[],
        categories: string[],
        username: string | undefined,
    }) {

    return (
        <>
            <ManagerNavBar username={username} />
        </>
    );
}