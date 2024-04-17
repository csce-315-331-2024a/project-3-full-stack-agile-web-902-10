import { getUserSession } from "@/lib/session";
import { prisma } from "@/lib/db";

import MenuNavBar from "@/components/MenuNavBar";
import CustomerMenuDesktop from "@/components/CustomerMenuDesktop";
import CustomerMenuMobile from "@/components/CustomerMenuMobile";

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
    const categories = Array.from(new Set(menu_items.map((item) => item.category)));

    return (
        <>
            <MenuNavBar username={user?.name.split(" ")[0]} is_manager={user?.is_manager} />
            <CustomerMenuDesktop menu_items_init={menu_items} categories_init={categories} />
            <CustomerMenuMobile menu_items={menu_items} categories={categories} />
        </>
    );
}
