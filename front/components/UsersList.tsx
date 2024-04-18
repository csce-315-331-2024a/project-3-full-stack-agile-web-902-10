"use client";

import { Users } from '@prisma/client';
import { useState, useEffect } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';

import { useSocket } from '@/lib/socket';

export default function UsersList({ users, user }:
    {
        users: Users[],
        user: Users | null
    }) {
    // const [users, setUsers] = useState<Users[]>(users);
    const filteredUsers = users.filter(user => user.is_manager);

    const socket: any = useSocket();
    const onFireEmployee = (user: Users) => {
        // Need to construct the packet that prisma would want, as well as the auth
        user.is_manager = false;
        user.is_employee = false;
        const packet = {
            email: user.email,
            jwt: user.jwt,
            data: {
                where : {
                    id : user.id
                },
                data : {
                    ...user
                }
            }
        };
        console.log(JSON.stringify(packet));
        socket.emit("users:update", JSON.stringify(packet));
    }

    return (
        <div>
            {/* <h1>Users</h1> */}
            <ul>
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
            </ul>
        </div>
    );
}
