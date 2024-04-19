"use client";

import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import { prisma } from './db';

export type AuthPacket = {
    email: string;
    jwt: string;
}
export type IngredientCreateQuery = Parameters<typeof prisma.ingredient.create>[0];
export type IngredientReadQuery = Parameters<typeof prisma.ingredient.findMany>[0];
export type IngredientUpdateQuery = Parameters<typeof prisma.ingredient.update>[0];
export type IngredientDeleteQuery = Parameters<typeof prisma.ingredient.delete>[0];
export type IngredientsMenuCreate = Parameters<typeof prisma.ingredients_Menu.create>[0];
export type IngredientsMenuRead = Parameters<typeof prisma.ingredients_Menu.findMany>[0];
export type IngredientsMenuUpdate = Parameters<typeof prisma.ingredients_Menu.update>[0];
export type IngredientsMenuDelete = Parameters<typeof prisma.ingredients_Menu.delete>[0];
export type LoginLogCreate = Parameters<typeof prisma.login_Log.create>[0];
export type LoginLogRead = Parameters<typeof prisma.login_Log.findMany>[0];
export type LoginLogUpdate = Parameters<typeof prisma.login_Log.update>[0];
export type LoginLogDelete = Parameters<typeof prisma.login_Log.delete>[0];
export type MenuItemCreate = Parameters<typeof prisma.menu_Item.create>[0];
export type MenuItemRead = Parameters<typeof prisma.menu_Item.findMany>[0];
export type MenuItemUpdate = Parameters<typeof prisma.menu_Item.update>[0];
export type MenuItemDelete = Parameters<typeof prisma.menu_Item.delete>[0];
export type OrderLogCreate = Parameters<typeof prisma.order_Log.create>[0];
export type OrderLogRead = Parameters<typeof prisma.order_Log.findMany>[0];
export type OrderLogUpdate = Parameters<typeof prisma.order_Log.update>[0];
export type OrderLogDelete = Parameters<typeof prisma.order_Log.delete>[0];
export type UsersCreate = Parameters<typeof prisma.users.create>[0];
export type UsersRead = Parameters<typeof prisma.users.findMany>[0];
export type UsersUpdate = Parameters<typeof prisma.users.update>[0];
export type UsersDelete = Parameters<typeof prisma.users.delete>[0];


export function useSocket(): ReturnType<typeof io> | null{
    const [socket, setSocket] = useState<null | ReturnType<typeof io>>(null);

    useEffect(() => {
        // localhost if local, and the server's IP if on vercel
        const ip = process.env.NODE_ENV === 'development' ? 'localhost:5000' : 'https://revs-websocket-26f326ba64e2.herokuapp.com/';
        const socketIo = io(ip);

        setSocket(socketIo);

        function cleanup() {
            socketIo.disconnect();
        }
        return cleanup;
    }, []);

    return socket
}
