import { getUserSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import CustomerMenu from "@/components/CustomerMenu";

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
        <CustomerMenu menu_items={menu_items} categories={categories} username={user?.name} is_manager={user?.is_manager}/>
    );
}
