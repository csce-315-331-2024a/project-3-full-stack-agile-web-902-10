import Link from "next/link";
import React from 'react'
import { prisma } from "@/lib/db";
import { Users } from '@prisma/client';
import UsersList from "@/components/UsersList";

export default async function UsersPage(){
    const users = await prisma.users.findMany();
    
    return <UsersList users={users} />;
}