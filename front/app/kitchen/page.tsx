import { getUserSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Roles } from "@prisma/client";

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

    if (!user || !(user.role === Roles.Admin || user.role === Roles.Manager || user.role === Roles.Kitchen || user.role === Roles.Cashier)) {
        return <Redirect to="/menu" />;
    }

    return (
        <>
            <KitchenNavBar user={user} />
            <KitchenDesktop user={user}/>
        </>
    );
}
