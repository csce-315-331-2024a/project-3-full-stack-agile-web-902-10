"use server";

import { prisma } from "@/lib/db";
import UsersList from "@/components/UsersList";

import { getUserSession } from "@/lib/session";
import Redirect from "@/components/Redirect";

export default async function UsersPage() {
    const users = await prisma.users.findMany();
    const session = await getUserSession();
    const user = await prisma.users.findUnique({ where: { email: session?.email ?? undefined } });

    if (!user || user.is_manager === false) {
        return <Redirect to="/menu" />;
    };

    return <UsersList users={users} user={user} />;
}
