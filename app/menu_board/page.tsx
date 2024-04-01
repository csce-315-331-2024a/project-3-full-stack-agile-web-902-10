import { prisma } from "@/lib/db";
import { Menu_Item } from "@prisma/client";
import MenuBoardClient from "@/components/MenuBoardClient";

export const metadata = {
    title: "Menu Board | Rev's Grill",
};

export default async function menu_board() {
    const menu_items = await prisma.menu_Item.findMany();
    const categories = Array.from(new Set(menu_items.map((item) => item.category)));
    
    
    return ( //calls the client side thing
        <MenuBoardClient menu_items={menu_items} categories={categories}/>
    );
}

