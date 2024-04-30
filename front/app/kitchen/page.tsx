import { getUserSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Roles } from "@prisma/client";

import KitchenDesktop from "@/app/kitchen/KitchenDesktop";
import KitchenNavBar from "@/app/kitchen/KitchenNavBar";

import Redirect from "@/components/Redirect";

export const metadata = {
    title: "Kitchen | Rev's Grill",
};

export default async function KitchenPage() {
    const user_session = await getUserSession();
    const user = user_session ? await prisma.users.findUnique({
        where: {
            email: user_session?.email ?? undefined,
        }
    }) : null;

    if (!user || !(user.role === Roles.Admin || user.role === Roles.Manager || user.role === Roles.Kitchen || user.role === Roles.Cashier)) {
        return <Redirect to="/menu" />;
    }

    const menu_items_init = await prisma.menu_Item.findMany();
    const ingredients_init = await prisma.ingredient.findMany();
    const ingredients_menu_init = await prisma.ingredients_Menu.findMany();
    const kitchen_init = await prisma.kitchen.findMany();

    return (
        <>
            <KitchenNavBar user={user} />
            <KitchenDesktop user={user} menu_items_init={menu_items_init} ingredients_init={ingredients_init}  ingredients_menu_init={ingredients_menu_init} kitchen_init={kitchen_init}/>
        </>
    );
}
