import { getUserSession } from "@/lib/session";
import { prisma } from "@/lib/db";

import CustomerMenuNavBar from "./CustomerMenuNavBar";
import CustomerMenuDesktop from "./CustomerMenuDesktop";

export const metadata = {
    title: "Menu | Rev's Grill",
};


export default async function MenuPage() {
    const user_session = await getUserSession();
    const user = user_session ? await prisma.users.findUnique({
        where: {
            email: user_session?.email ?? undefined
        }
    }) : null;

    const menu_items = await prisma.menu_Item.findMany();
    const ingredients = await prisma.ingredient.findMany();
    const ingredients_menus = await prisma.ingredients_Menu.findMany();

    return (
        <>
            <CustomerMenuNavBar user={user} />
            <CustomerMenuDesktop menu_items_init={menu_items} ingredients_init={ingredients} ingredient_menus_init={ingredients_menus} user={user} />
        </>
    );
}
