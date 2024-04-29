import { getUserSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Roles } from "@prisma/client";

import CashierMenuDesktop from "./CashierMenuDesktop";
import CashierMenuNavBar from "./CashierMenuNavBar";
import Redirect from "@/components/Redirect";

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

    const menu_items = await prisma.menu_Item.findMany({
        where : {
            is_active: true
        }
    });
    const ingredients = await prisma.ingredient.findMany();
    const ingredients_menus = await prisma.ingredients_Menu.findMany();

    if (!user || (user.role !== Roles.Cashier && user.role !== Roles.Manager && user.role !== Roles.Admin)) {
        return <Redirect to="/menu" />;
    }

    return (
        <>
            <CashierMenuNavBar user={user} ingredient_menus={ingredients_menus} ingredients={ingredients} />
            <CashierMenuDesktop menu_items_init={menu_items} ingredients_init={ingredients} ingredient_menus_init={ingredients_menus} user={user}/>
        </>
    );
}
