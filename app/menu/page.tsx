import { getUserSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Menu_Item } from "@prisma/client";
import CustomerMenu from "@/components/CustomerMenu";

export const metadata = {
    title: "Menu | Rev's Grill",
};

async function getMenuItemsWithSufficientIngredients() {
    const menuItems = await prisma.$queryRaw<Menu_Item[]>`     SELECT mi.*     FROM "Menu_Item" mi     WHERE NOT EXISTS (       SELECT 1       FROM "Ingredients_Menu" im       JOIN "Ingredient" i ON im."ingredients_id" = i."id"       WHERE im."menu_id" = mi."id"         AND i."stock" < im."quantity"     )   `;
    return menuItems;
}

export default async function MenuPage() {
    const user_session = await getUserSession();
    const user = user_session ? await prisma.users.findUnique({
        where: {
            email: user_session?.email ?? undefined
        }
    }) : null;

    const menu_items = await getMenuItemsWithSufficientIngredients();
    const categories = Array.from(new Set(menu_items.map((item) => item.category)));

    return (
        <CustomerMenu menu_items={menu_items} categories={categories} username={user?.name} is_manager={user?.is_manager} />
    );
}
