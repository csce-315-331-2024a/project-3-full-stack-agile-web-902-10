import { prisma } from "@/lib/db";
import { Menu_Item } from "@prisma/client";
import MenuBoardClient from "@/components/MenuBoardClient";
import { getTemperature } from '../api/weather';
import { getCondition } from '../api/weather';

export const metadata = {
    title: "Menu Board | Rev's Grill",
};

export default async function menu_board() {
    const menu_items = await prisma.menu_Item.findMany();
    const categories = Array.from(new Set(menu_items.map((item) => item.category)));
    const temperature = await getTemperature();
    const condition = await getCondition();

    
    
    return ( //calls the client side thing
        //<MenuBoardClient menu_items={menu_items} categories1={categories}/>
        <MenuBoardClient  temperature={temperature} condition={condition}/>
    );
}

