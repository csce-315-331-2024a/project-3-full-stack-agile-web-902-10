import { getUserSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Order_Log } from "@prisma/client";

import KitchenDesktop from "@/app/kitchen/KitchenDesktop";

export const metadata = {
    title: "Kitchen | Rev's Grill",
};


export default async function KitchenPage() {
    const user_session = await getUserSession();
    const user = user_session ? await prisma.users.findUnique({
        where : {
            email : user_session?.email ?? undefined,
        }
    }) : null;

    const orders = await prisma.order_Log.findMany();

    return (
        <>
            {/* <KitchenNavBar user={user} /> */}
            <KitchenDesktop orders_init={orders} />
        </>
    );
}
