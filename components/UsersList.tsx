// components/UsersList.js

import { Users } from '@prisma/client';
import React from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Popover, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';

export default function UsersList({ users }: 
    {
        users: Users[]
    }) {
  
    const filteredUsers = users.filter(user => user.is_employee);

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
                <Button variant="outline" className="flex-col justify-evenly w-[25vw] h-[20vh]">
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    {/* <Image
                        src={menu_item.image_url}
                        width={200}
                        height={200}
                        alt={menu_item.name}
                        className="aspect-[1/1] h-[200px] w-[200px] object-cover rounded-3xl border"
                    /> */}
                    <h2 className="text-2xl">{user.is_manager?"Manager":"Employee"}</h2>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{user.name}</DialogTitle>
                    <DialogDescription>{user.is_manager?"Manager":"Employee"}</DialogDescription>
                </DialogHeader>
                    <div>
                    <div className="p-2">
                    <input type = "text" id = "name" className="w-64 h-2 p-2" placeholder={user.name}/>
                    <Textarea className="w-64 h-2 p-2" placeholder="Type item catagory here." id="message" />
                    

<form>
    <div className="flex">
        <button id="dropdown-button" data-dropdown-toggle="dropdown" className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-e-0 border-gray-300 dark:border-gray-700 dark:text-white rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800" type="button">All categories <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
  </svg></button>
        <div id="dropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
            <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Shopping</a>
            </li>
            <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Images</a>
            </li>
            <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">News</a>
            </li>
            <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Finance</a>
            </li>
            </ul>
        </div>
        <div className="relative w-full">
            <input type="search" id="search-dropdown" className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg rounded-s-gray-100 rounded-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Search" required />
            <button type="submit" className="absolute top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"><svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
  </svg></button>
        </div>
    </div>
</form>


                    </div>
                    <div className="p-2">
                    </div>
                        <ScrollArea className="h-[40vh] w-100 p-2 whitespace-nowrap">
                            <div className="flex-col space-y-4">
                            {/* {ingredients.map((item, index) => (
                                <div key={index} className="flex items-center">
                                    <Checkbox/>
                                        <label className="p-2">{item.name}</label>
                                    </div>
                                ))} */}
                            </div>
                        </ScrollArea>
                    </div>
                    <div>
                        <DialogClose asChild>
                            <Button variant="default">Add Item</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button variant={"destructive"} >Cancel</Button>
                        </DialogClose>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="destructive" /*onClick={() => onFireEmployee(user)}*/>Fire</Button>
                        </DialogClose>
                    </DialogFooter>                      
            </DialogContent>
        </Dialog>
          ))}
        </ul>
      </div>
    );
}
