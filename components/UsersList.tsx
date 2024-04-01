// components/UsersList.js

import { Users } from '@prisma/client';
import React from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';

export default function UsersList({ users }: 
    {
        users: Users[]
    }) {
  
    const filteredUsers = users.filter(user => user.is_manager);

    const onFireEmployee = (user: Users) => {
      
    }
    
    return (
      <div>
        <h1>Users</h1>
          <Button variant="outline" className="flex-col justify-evenly w-[14vw] h-[8vh]">
              <h2 className="text-2xl font-bold">Add Employee</h2>
          </Button>
        <ul>
          {filteredUsers.map(user => (
            <Dialog key={user.id}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex-col justify-evenly w-[25vw] h-[40vh]">
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    {/* <Image
                        src={menu_item.image_url}
                        width={200}
                        height={200}
                        alt={menu_item.name}
                        className="aspect-[1/1] h-[200px] w-[200px] object-cover rounded-3xl border"
                    /> */}
                    <h2 className="text-2xl">{user.is_manager?"manager":"employee"}</h2>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{user.name}</DialogTitle>
                    <DialogDescription>{user.is_manager?"manager":"employee"}</DialogDescription>
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
                        <Button variant="default" /*onClick={() => onFireEmployee(user)}*/>Fire</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
          ))}
        </ul>
      </div>
    );
}
