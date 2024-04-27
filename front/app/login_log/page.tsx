import { getUserSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Roles } from "@prisma/client";

import LoginLogDesktop from "./LoginLogDesktop";
import LoginLogNavBar from "./LoginLogNavBar";

import Redirect from "@/components/Redirect";

export const metadata = {
    title: "Order History | Rev's Grill",
};

export default async function OrderHistoryPage() {
    const user_session = await getUserSession();
    const user = user_session ? await prisma.users.findUnique({
        where: {
            email: user_session?.email ?? undefined,
        }
    }) : null;

    if (!user || !(user.role === Roles.Admin || user.role === Roles.Manager || user.role === Roles.Kitchen)) {
        return <Redirect to="/menu" />;
    }

    return (
        <>
            <LoginLogNavBar user={user}/>
            <LoginLogDesktop />
        </>
    );
}