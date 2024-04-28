import { getUserSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import ManagerNavBar from "@/components/ManagerNavBar";
import ManagerFunctions from "@/components/ManagerFunctions";
import Redirect from "@/components/Redirect";
import { Ingredients_Menu, Menu_Item, Roles } from "@prisma/client";

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
    const categories = Array.from(new Set(menu_items.map((item: Menu_Item) => item.category)));
    const ingredients = await prisma.ingredient.findMany();
    const menuIngredients = await prisma.ingredients_Menu.findMany();
    const users = await prisma.users.findMany();

    if ((user === null) || (user.role === Roles.Customer)) {
        return <Redirect to="/menu" />;
    };

    return (
        <>
            <ManagerNavBar username={user?.name} />
            <ManagerFunctions menu_items_init={menu_items} categories_init={categories} menuIngredients_init={menuIngredients} ingredients_init={ingredients} users_init={users} user={user} />
        </>
    );
}
