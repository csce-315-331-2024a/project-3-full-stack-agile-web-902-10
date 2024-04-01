import { prisma } from "@/lib/db";
import { Menu_Item } from "@prisma/client";
import menu_board_client from "@/components/menu_board_client";


export default async function menu_board() {
    const menu_items = await prisma.menu_Item.findMany();
    const categories = Array.from(new Set(menu_items.map((item) => item.category)));
    
    
    return (
        <menu_board_client menu_items={menu_items} categories={categories}/>
    );
}

