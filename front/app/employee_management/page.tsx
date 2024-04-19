"use server";

import { prisma } from "@/lib/db";
import UsersList from "@/components/UsersList";

import { getUserSession } from "@/lib/session";

export default async function UsersPage() {
    const users = await prisma.users.findMany();
    const session = await getUserSession();
    const user = await prisma.users.findUnique({ where: { email: session?.email ?? undefined } });

    return <UsersList users={users} user={user} />;
}
