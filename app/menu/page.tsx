import MenuNavBar from "@/components/MenuNavBar";
import { getUserSession } from "@/lib/session";
import { prisma } from "@/lib/db";

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

    return (
        <>
            <MenuNavBar username={user?.name} is_manager={user?.is_manager} />
        </>
    );
}
