"use client";

import { Users } from '@prisma/client';
import { useState, useEffect } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';

import { AuthPacket, useSocket } from '@/lib/socket';
import { ScrollArea } from './ui/scroll-area';

export default function UsersList({ users, user }:
    {
        users: Users[],
        user: Users | null
    }) {
    const [filteredUsers, setFilteredUsers] = useState<Users[]>(users.filter(user => user.is_manager));

    const socket = useSocket();
    useEffect(() => {
        if (socket) {
            socket.emit("users:read", undefined, (new_users: Users[]) => {
                setFilteredUsers(new_users.filter(user => user.is_manager));
            });
            socket.on("users", (new_users: Users[]) => {
                setFilteredUsers(new_users.filter(user => user.is_manager));
            });
        }
    }, [socket]);

    const auth: AuthPacket = {
        email: user?.email ?? "",
        jwt: user?.jwt ?? ""
    };
    const onFireEmployee = (user: Users) => {
        socket?.emit("users:update", auth, user);
    }

    return (
        <ScrollArea className="h-[92vh] w-[90vw] p-8 whitespace-nowrap">
            <div className="grid grid-cols-3 gap-4">
                {/* <h1>Users</h1> */}
                {filteredUsers.map(user => (
                    <Dialog key={user.id}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex-col justify-evenly w-[25vw] h-[20vh]">
                                <h2 className="text-2xl font-bold">{user.name}</h2>
                                {/* <Image
                        src={menu_item.image_url}
                        width={200}
                        height={200}
                        alt={menu_item.name}
                        className="aspect-[1/1] h-[200px] w-[200px] object-cover rounded-3xl border"
                    /> */}
                                <h2 className="text-2xl">{user.is_manager ? "Manager" : "Employee"}</h2>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{user.name}</DialogTitle>
                                <DialogDescription>{user.is_manager ? "Manager" : "Employee"}</DialogDescription>
                            </DialogHeader>
                            {/* <Image
                    src={menu_item.image_url}
                    width={200}
                    height={200}
                    alt={menu_item.name}
                    className="aspect-[1/1] h-[200px] w-[200px] object-cover rounded-3xl border"
                /> */}

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="destructive" onClick={() => onFireEmployee(user)}>Fire</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                ))}
            </div>
        </ScrollArea>
    );
}
