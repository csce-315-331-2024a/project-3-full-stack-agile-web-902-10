import { prisma } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import CheckoutPage from "./CheckoutPage";
import CheckoutNavBar from "./CheckoutNavBar";

export default async function Checkout() {
    const user_session = await getUserSession();
    const user = user_session ? await prisma.users.findUnique({
        where: {
            email: user_session?.email ?? undefined
        }
    }) : null;

    const menu_items_initial = await prisma.menu_Item.findMany();
    const ingredients_initial = await prisma.ingredient.findMany();
    const ingredients_menu_item_initial = await prisma.ingredients_Menu.findMany();

    return (
        <>
            <CheckoutNavBar user={user} />
            <CheckoutPage user={user} menu_items_inital={menu_items_initial} ingredients_initial={ingredients_initial} ingredients_menu_item_initial={ingredients_menu_item_initial} />
        </>
    );
}