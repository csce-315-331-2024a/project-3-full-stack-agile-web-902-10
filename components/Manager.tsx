import ManagerNavBar from "@/components/ManagerNavBar";
import ManagerFunctions from "@/components/ManagerFunctions";
// import CustomerMenuMobile from "@/components/CustomerMenuMobile";
import { Menu_Item, Ingredient, Ingredients_Menu, Users } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getUserSession } from "@/lib/session";

export default async function Manager({ menu_items, categories, username, menuIngredients, ingredients, users}:
    {
        menu_items: Menu_Item[],
        categories: string[],
        username: string | undefined,
        menuIngredients: Ingredients_Menu[],
        ingredients: Ingredient[],
        users: Users[]
    }) {
    const session = await getUserSession();
    const session_info = await prisma.users.findUnique({where : {email : session?.email ?? undefined}});

    return (
        <>
            <ManagerNavBar username={username} />
            <ManagerFunctions menu_items={menu_items} categories={categories} menuIngredients={menuIngredients} ingredients={ingredients} users={users} session_info={session_info}/>
        </>
    );
}
