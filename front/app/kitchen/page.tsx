import { getUserSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Order_Log, Order_Status, Roles } from "@prisma/client";

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

    if (!user || !(user.role === Roles.Admin || user.role === Roles.Manager || user.role === Roles.Kitchen)) {
        return <Redirect to="/menu" />;
    }

    const orders = await prisma.order_Log.findMany({
        where: {
            status: {
                not: Order_Status.Completed,
            }
        },
    });

    const menu_items = await prisma.menu_Item.findMany();
    const ingredients = await prisma.ingredient.findMany();
    const ingredients_menu = await prisma.ingredients_Menu.findMany();

    return (
        <>
            <KitchenNavBar user={user} />
            <KitchenDesktop orders_init={orders.sort( (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())} menu_items_init={menu_items} ingredients_init={ingredients} ingredients_menu_init={ingredients_menu} user={user} />
        </>
    );
}
