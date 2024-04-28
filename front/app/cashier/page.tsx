import { getUserSession } from "@/lib/session";
import { prisma } from "@/lib/db";

import CashierNavBar from "@/components/CashierNavBar";
import CashierMenuDesktop from "@/components/CashierMenuDesktop";
import Redirect from "@/components/Redirect";

export const metadata = {
    title: "Menu | Rev's Grill",
};

export default async function CashierPage() {
    const user_session = await getUserSession();
    const user = user_session ? await prisma.users.findUnique({
        where: {
            email: user_session?.email ?? undefined
        }
    }) : null;

    const menu_items = await prisma.menu_Item.findMany();

    if (!user || user.is_manager === false) {
        return <Redirect to="/menu" />;
    };

    return (
        <>
            <CashierNavBar user={user} />
            <CashierMenuDesktop menu_items_init={menu_items} />
        </>
    );
}

