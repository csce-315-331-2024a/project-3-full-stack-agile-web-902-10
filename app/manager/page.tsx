import { getUserSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import Manager from "@/components/Manager";
//import { Menu_Item } from "@prisma/client";

export const metadata = {
    title: "Manager | Rev's Grill",
};

export default async function ManagerPage() {
    const user_session = await getUserSession();
    const user = user_session ? await prisma.users.findUnique({
        where: {
            email: user_session?.email ?? undefined
        }
    }) : null;

    // const menu_items = await prisma.$queryRaw<Menu_Item[]>`SELECT DISTINCT mi.* FROM "Menu_Item" mi JOIN "Menus_Ingredients" mi_ing ON mi.id = mi_ing.menu_item_id JOIN "Ingredient" i ON mi_ing.ingredient_id = i.id WHERE i.stock > 0;`;
    const menu_items = await prisma.menu_Item.findMany();
    const categories = Array.from(new Set(menu_items.map((item) => item.category)));
    //const ingredient = await prisma.ingredient.findMany();

    return (
        <Manager menu_items={menu_items} categories={categories} username={user?.name} />
    );
}