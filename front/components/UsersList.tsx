"use client";

import { Roles, Users } from '@prisma/client';
import { useState, useEffect } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';

import { AuthPacket, useSocket } from '@/lib/socket';
import { ScrollArea } from './ui/scroll-area';
import { useRouter } from 'next/navigation';

function maskEmail(email: string) {
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) {
        return 'Invalid email';
    }
    const firstChar = localPart[0];
    const maskedPart = '*'.repeat(localPart.length - 1);
    return `${firstChar}${maskedPart}@${domain}`;
};


/**
 * Renders a list of users with their roles and allows changing the roles.
 * @param users - An array of user objects.
 * @param user - The currently logged-in user object.
 */
export default function UsersList({ users, user }:
    {
        users: Users[],
        user: Users | null
    }) {

    const roleOrder = {
        "Admin": 0,
        "Manager": 1,
        "Kitchen": 2,
        "Cashier": 3,
        "Customer": 4
    };

    const [filteredUsers, setFilteredUsers] = useState<Users[]>(users.sort((a, b) => { return roleOrder[a.role] - roleOrder[b.role]; }));



    const socket = useSocket();
    const router = useRouter();
    useEffect(() => {
        if (socket) {
            socket.emit("users:read", undefined, (new_users: Users[]) => {
                // sort by role
                new_users.sort((a, b) => {
                    return roleOrder[a.role] - roleOrder[b.role];
                });
                setFilteredUsers(new_users);
            });
            socket.on("users", (new_users: Users[]) => {
                const updated_user = new_users.find((u) => u.id === user?.id);
                if (updated_user === undefined || (updated_user.role !== Roles.Kitchen && updated_user.role !== Roles.Cashier && updated_user.role !== Roles.Manager && updated_user.role !== Roles.Admin) ) {
                    router.push("/menu");
                }
                // sort by role
                new_users.sort((a, b) => {
                    return roleOrder[a.role] - roleOrder[b.role];
                });
                setFilteredUsers(new_users);
            });
        }
    }, [socket]);

    const auth: AuthPacket = {
        email: user?.email ?? "",
        jwt: user?.jwt ?? ""
    };
    
    const onFireEmployee = (user: Users) => {
        socket?.emit("users:update", auth, user);
    };

    return (
        <ScrollArea className="h-[92vh] w-[90vw] p-8 whitespace-nowrap">
            <div className="grid grid-cols-3 gap-4">
                {filteredUsers.map(user => (
                    <Dialog key={user.id}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex-col w-[25vw] h-[20vh]">
                                <h2 className="text-3xl font-bold">{user.name}</h2>
                                <p className="text-slate-500 py-4">{maskEmail(user.email)}</p>
                                <h1 className="text-xl">{user?.role}</h1>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="">
                            <DialogHeader>
                                <DialogTitle>{user.role + ": " + user.name}</DialogTitle>
                                <DialogDescription>Change this role?</DialogDescription>
                            </DialogHeader>
                            <DialogClose asChild>
                                <div className="flex flex-col gap-4">
                                    {Object.values(Roles).map((role) => (
                                        <Button
                                            key={role}
                                            variant="outline"
                                            onClick={() => socket?.emit("users:update", auth, { where: { id: user.id }, data: { role: role } })}
                                            className="mx-2"
                                        >
                                            {role}
                                        </Button>
                                    ))}
                                </div>
                            </DialogClose>
                        </DialogContent>
                    </Dialog>
                ))}
            </div>
        </ScrollArea>
    );
}
