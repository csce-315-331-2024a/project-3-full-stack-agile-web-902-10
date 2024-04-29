import { prisma } from "@/lib/db";
import { Menu_Item } from "@prisma/client";
import MenuBoardClient from "@/components/MenuBoardClient";
import { getTemperature } from '../api/weather';
import { getCondition } from '../api/weather';

export const metadata = {
    title: "Menu Board | Rev's Grill",
};

export default async function menu_board() {
    const menu_items = await prisma.menu_Item.findMany({where: {is_active: true}});
    const categories = Array.from(new Set(menu_items.map((item) => item.category)));
    const temperature = await getTemperature();
    const condition = await getCondition();
    
    return ( //calls the client side thing
    <MenuBoardClient menu_items_init={menu_items} categories_init={categories} temperature_init={temperature} condition_init={condition}/>
    );
}

