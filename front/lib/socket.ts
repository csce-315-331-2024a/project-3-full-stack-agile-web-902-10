/**
 * This module provides a socket connection to the server using socket.io-client.
 * It exports various types and a function to use the socket connection.
 */

"use client";

import io from 'socket.io-client'
import { prisma } from './db';

/**
 * Represents the authentication packet sent to the server.
 */
export type AuthPacket = {
    email: string;
    jwt: string;
}

// Types for CRUD operations on different database tables

export type IngredientCreate = Parameters<typeof prisma.ingredient.create>[0];
export type IngredientRead = Parameters<typeof prisma.ingredient.findMany>[0];
export type IngredientUpdate = Parameters<typeof prisma.ingredient.update>[0];
export type IngredientDelete = Parameters<typeof prisma.ingredient.delete>[0];

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

export type KitchenCreate = Parameters<typeof prisma.kitchen.create>[0];
export type KitchenRead = Parameters<typeof prisma.kitchen.findMany>[0];
export type KitchenUpdate = Parameters<typeof prisma.kitchen.update>[0];
export type KitchenDelete = Parameters<typeof prisma.kitchen.deleteMany>[0];

/**
 * The socket connection to the server.
 */
const socket = io(process.env.NODE_ENV === 'development' ? 'localhost:5000' : 'https://revs-websocket-26f326ba64e2.herokuapp.com/');

/**
 * Returns the socket connection to be used in the application.
 * @returns The socket connection.
 */
export function useSocket() {
    return socket;
}
