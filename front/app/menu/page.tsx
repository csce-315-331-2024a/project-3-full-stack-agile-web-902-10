import { getUserSession } from "@/lib/session";
import { prisma } from "@/lib/db";

import CustomerMenuNavBar from "./CustomerMenuNavBar";
import CustomerMenuDesktop from "./CustomerMenuDesktop";
import CustomerMenuMobile from "./CustomerMenuMobile";

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

    return (
        <>
            <CustomerMenuNavBar user={user} />
            <CustomerMenuDesktop menu_items_init={menu_items} user={user}/>
            {/* <CustomerMenuMobile menu_items_init={menu_items} categories_init={categories} user={user}/> */}
        </>
    );
}
