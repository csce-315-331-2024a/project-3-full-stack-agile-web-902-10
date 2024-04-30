import {
    Ingredient,
    Ingredients_Menu,
    Login_Log,
    Menu_Item,
    Order_Log,
    Users,
    Roles,
} from "@prisma/client";

import translate, { googleTranslateApi } from "google-translate-api-x";
import prisma from "./client";
import { io } from "./socket";

/**
 * The authentication packet
 */
export type AuthPacket = {
    /**
     * The email of the user
     */
    email: string;

    /**
     * The JWT of the user
     */
    jwt: string;
}

/**
 * The ingredient create query
 */
export type IngredientCreate = Parameters<typeof prisma.ingredient.create>[0];

/**
 * The ingredient read query
 */
export type IngredientRead = Parameters<typeof prisma.ingredient.findMany>[0];

/**
 * The ingredient update query
 */
export type IngredientUpdate = Parameters<typeof prisma.ingredient.update>[0];

/**
 * The ingredient delete query
 */
export type IngredientDelete = Parameters<typeof prisma.ingredient.delete>[0];

/**
 * The ingredients menu create query
 */
export type IngredientsMenuCreate = Parameters<typeof prisma.ingredients_Menu.create>[0];

/**
 * The ingredients menu read query
 */
export type IngredientsMenuRead = Parameters<typeof prisma.ingredients_Menu.findMany>[0];

/**
 * The ingredients menu update query
 */
export type IngredientsMenuUpdate = Parameters<typeof prisma.ingredients_Menu.update>[0];

/**
 * The ingredients menu delete query
 */
export type IngredientsMenuDelete = Parameters<typeof prisma.ingredients_Menu.delete>[0];

/**
 * The login log create query
 */
export type LoginLogCreate = Parameters<typeof prisma.login_Log.create>[0];

/**
 * The login log read query
 */
export type LoginLogRead = Parameters<typeof prisma.login_Log.findMany>[0];

/**
 * The login log update query
 */
export type LoginLogUpdate = Parameters<typeof prisma.login_Log.update>[0];

/**
 * The login log delete query
 */
export type LoginLogDelete = Parameters<typeof prisma.login_Log.delete>[0];

/**
 * The menu item create query
 */
export type MenuItemCreate = Parameters<typeof prisma.menu_Item.create>[0];

/**
 * The menu item read query
 */
export type MenuItemRead = Parameters<typeof prisma.menu_Item.findMany>[0];

/**
 * The menu item update query
 */
export type MenuItemUpdate = Parameters<typeof prisma.menu_Item.update>[0];

/**
 * The menu item delete query
 */
export type MenuItemDelete = Parameters<typeof prisma.menu_Item.delete>[0];

/**
 * The order log create query
 */
export type OrderLogCreate = Parameters<typeof prisma.order_Log.create>[0];

/**
 * The order log read query
 */
export type OrderLogRead = Parameters<typeof prisma.order_Log.findMany>[0];

/**
 * The order log update query
 */
export type OrderLogUpdate = Parameters<typeof prisma.order_Log.update>[0];

/**
 * The order log delete query
 */
export type OrderLogDelete = Parameters<typeof prisma.order_Log.delete>[0];

/**
 * The users create query
 */
export type UsersCreate = Parameters<typeof prisma.users.create>[0];

/**
 * The users read query
 */
export type UsersRead = Parameters<typeof prisma.users.findMany>[0];

/**
 * The users update query
 */
export type UsersUpdate = Parameters<typeof prisma.users.update>[0];

/**
 * The users delete query
 */
export type UsersDelete = Parameters<typeof prisma.users.delete>[0];

/**
 * The kitchen create query
 */
export type KitchenCreate = Parameters<typeof prisma.kitchen.create>[0];

/**
 * The kitchen read query
 */
export type KitchenRead = Parameters<typeof prisma.kitchen.findMany>[0];

/**
 * The kitchen update query
 */
export type KitchenUpdate = Parameters<typeof prisma.kitchen.update>[0];

/**
 * The kitchen delete query
 */
export type KitchenDelete = Parameters<typeof prisma.kitchen.deleteMany>[0];

/**
 * Helper function that verifies the {@link AuthPacket}
 * @param email the email to be verified
 * @param jwt the JWT to be verified
 * @returns true if the token is valid, false otherwise
 */
export async function verifyToken(email: string, jwt: string): Promise<boolean> {
    try {
        const user = await prisma.users.findUnique({ where: { email: email } });

        if (!user) {
            return false;
        }
        if (user.jwt !== jwt) {
            return false;
        }
        if (user.role === Roles.Customer) {
            return false;
        }
        return true;
    } catch (error) {
        console.error("ERROR: " + error);
        return false;
    }
}

/**
 * Route that creates a new ingredient, sends a broadcast to all clients that are subscribed to the ingredient event
 * @param auth the {@link AuthPacket}
 * @param create_query the {@link IngredientCreate}
 * @returns void
 */
export async function ingredientCreate(auth: AuthPacket, create_query: IngredientCreate) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const newIngredient = await prisma.ingredient.create(create_query);
        io.emit("ingredient", await prisma.ingredient.findMany());
        console.log(await prisma.ingredient.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that reads all ingredients, sends a callback to the client
 * @param read_query the {@link IngredientRead}
 * @param callback the callback function
 * @returns void
 */
export async function ingredientRead(read_query: IngredientRead, callback: any) {
    try {
        callback(await prisma.ingredient.findMany(read_query || {}));
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that updates an ingredient, sends a broadcast to all clients that are subscribed to the ingredient event
 * @param auth the {@link AuthPacket}
 * @param update_query the {@link IngredientUpdate}
 * @returns void
 */
export async function ingredientUpdate(auth: AuthPacket, update_query: IngredientUpdate) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const updatedIngredient = await prisma.ingredient.update(update_query);
        io.emit("ingredient", await prisma.ingredient.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that deletes an ingredient, sends a broadcast to all clients that are subscribed to the ingredient event
 * @param auth the {@link AuthPacket}
 * @param delete_query the {@link IngredientDelete}
 * @returns void
 */
export async function ingredientDelete(auth: AuthPacket, delete_query: IngredientDelete) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        await prisma.ingredient.delete(delete_query);
        io.emit("ingredient", await prisma.ingredient.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that creates a new ingredients menu, sends a broadcast to all clients that are subscribed to the ingredients menu event
 * @param auth the {@link AuthPacket}
 * @param create_query the {@link IngredientsMenuCreate}
 * @returns void
 */
export async function ingredientsMenuCreate(auth: AuthPacket, create_query: IngredientsMenuCreate) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const newIngredientsMenu = await prisma.ingredients_Menu.create(create_query);
        io.emit("ingredientsMenu", await prisma.ingredients_Menu.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that reads all ingredients menu, sends a callback to the client
 * @param read_query the {@link IngredientsMenuRead}
 * @param callback the callback function
 * @returns void
 */
export async function ingredientsMenuRead(read_query: IngredientsMenuRead, callback: any) {
    try {
        callback(await prisma.ingredients_Menu.findMany(read_query || {}));
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that updates an ingredients menu, sends a broadcast to all clients that are subscribed to the ingredients menu event
 * @param auth the {@link AuthPacket}
 * @param update_query the {@link IngredientsMenuUpdate}
 * @returns void
 */
export async function ingredientsMenuUpdate(auth: AuthPacket, update_query: IngredientsMenuUpdate) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const updatedIngredientsMenu = await prisma.ingredients_Menu.update(update_query);
        io.emit("ingredientsMenu", await prisma.ingredients_Menu.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that deletes an ingredients menu, sends a broadcast to all clients that are subscribed to the ingredients menu event
 * @param auth the {@link AuthPacket}
 * @param delete_query the {@link IngredientsMenuDelete}
 * @returns void
 */
export async function ingredientsMenuDelete(auth: AuthPacket, delete_query: IngredientsMenuDelete) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        await prisma.ingredients_Menu.delete(delete_query);
        io.emit("ingredientsMenu", await prisma.ingredients_Menu.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that creates a new login log, sends a broadcast to all clients that are subscribed to the login log event
 * @param auth the {@link AuthPacket}
 * @param create_query the {@link LoginLogCreate}
 * @returns void
 */
export async function loginLogCreate(auth: AuthPacket, create_query: LoginLogCreate) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const newLoginLog = await prisma.login_Log.create(create_query);
        io.emit("loginLog", await prisma.login_Log.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that reads all login logs, sends a callback to the client
 * @param read_query the {@link LoginLogRead}
 * @param callback the callback function
 * @returns void
 */
export async function loginLogRead(read_query: LoginLogRead, callback: any) {
    try {
        callback(await prisma.login_Log.findMany(read_query || {}));
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that updates a login log, sends a broadcast to all clients that are subscribed to the login log event
 * @param auth the {@link AuthPacket}
 * @param update_query the {@link LoginLogUpdate}
 * @returns void
 */
export async function loginLogUpdate(auth: AuthPacket, update_query: LoginLogUpdate) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const updatedLoginLog = await prisma.login_Log.update(update_query);
        io.emit("loginLog", await prisma.login_Log.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that deletes a login log, sends a broadcast to all clients that are subscribed to the login log event
 * @param auth the {@link AuthPacket}
 * @param delete_query the {@link LoginLogDelete}
 * @returns void
 */
export async function loginLogDelete(auth: AuthPacket, delete_query: LoginLogDelete) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        await prisma.login_Log.delete(delete_query);
        io.emit("loginLog", await prisma.login_Log.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that creates a new menu item, sends a broadcast to all clients that are subscribed to the menu item event
 * @param auth the {@link AuthPacket}
 * @param create_query the {@link MenuItemCreate}
 * @returns void
 */
export async function menuItemCreate(auth: AuthPacket, create_query: MenuItemCreate) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const newMenuItem = await prisma.menu_Item.create(create_query);
        io.emit("menuItem", await prisma.menu_Item.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that reads all menu items, sends a callback to the client
 * @param read_query the {@link MenuItemRead}
 * @param callback the callback function
 * @returns void
 */
export async function menuItemRead(read_query: MenuItemRead, callback: any) {
    try {
        callback(await prisma.menu_Item.findMany(read_query || {}));
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that updates a menu item, sends a broadcast to all clients that are subscribed to the menu item event
 * @param auth the {@link AuthPacket}
 * @param update_query the {@link MenuItemUpdate}
 * @returns void
 */
export async function menuItemUpdate(auth: AuthPacket, update_query: MenuItemUpdate) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const updatedMenuItem = await prisma.menu_Item.update(update_query);
        io.emit("menuItem", await prisma.menu_Item.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that adds a menu item, sends a broadcast to all clients that are subscribed to the menu item event
 * @param auth the {@link AuthPacket}
 * @param menu_item the {@link Menu_Item}
 * @param ingredients the {@link Ingredient} id values
 * @param ratios the ratio array
 * @param callback the callback function
 * @returns void
 */
export async function menuItemAdd(auth: AuthPacket, menu_item: Menu_Item, ingredients: Ingredient[], ratios: number[], callback: any) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const newMenuItem = await prisma.menu_Item.create({
            data: {
                name: menu_item.name,
                price: menu_item.price,
                image_url: menu_item.image_url,
                category: menu_item.category,
                is_active: menu_item.is_active,
            },
        });
        for (let i = 0; i < ingredients.length; i++) {
            await prisma.ingredients_Menu.create({
                data: {
                    ingredients_id: ingredients[i].id,
                    menu_id: newMenuItem.id,
                    quantity: ratios[i],
                },
            });
        }
        io.emit("menuItem", await prisma.menu_Item.findMany());
        io.emit("ingredientMenu", await prisma.ingredients_Menu.findMany());

    } catch (error) {
        console.error("ERROR: " + error);
        callback(error);
    }
}

/**
 * Route that deletes a menu item, sends a broadcast to all clients that are subscribed to the menu item event
 * @param auth the {@link AuthPacket}
 * @param delete_query the {@link MenuItemDelete}
 * @returns void
 */
export async function menuItemDelete(auth: AuthPacket, delete_query: MenuItemDelete) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const menu_id = await prisma.menu_Item.findUnique({
            where: {
                name: delete_query.where.name,
            },
        });
        await prisma.ingredients_Menu.deleteMany({
            where: {
                menu_id: menu_id?.id,
            },
        });
        await prisma.menu_Item.delete(delete_query);
        io.emit("menuItem", await prisma.menu_Item.findMany());
        io.emit("ingredientMenu", await prisma.ingredients_Menu.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that deletes menu item's ingredients, sends a broadcast to all clients that are subscribed to the menu item event
 * @param auth the {@link AuthPacket}
 * @param menu_item the {@link Menu_Item}
 * @returns void
 */
export async function menuItemClear(auth: AuthPacket, menu_item: Menu_Item) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        await prisma.ingredients_Menu.deleteMany({
            where: {
                menu_id: menu_item.id,
            },
        });
        io.emit("menuItem", await prisma.menu_Item.findMany());
        io.emit("ingredientMenu", await prisma.ingredients_Menu.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that creates a new order log, sends a broadcast to all clients that are subscribed to the order log event
 * @param auth the {@link AuthPacket}
 * @param create_query the {@link OrderLogCreate}
 * @returns void
 */
export async function orderLogCreate(auth: AuthPacket, create_query: OrderLogCreate) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const newOrderLog = await prisma.order_Log.create(create_query);
        io.emit("orderLog", await prisma.order_Log.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that reads all order logs, sends a callback to the client
 * @param read_query the {@link OrderLogRead}
 * @param callback the callback function
 * @returns void
 */
export async function orderLogRead(read_query: OrderLogRead, callback: any) {
    try {
        callback(await prisma.order_Log.findMany(read_query || {}));
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that updates an order log, sends a broadcast to all clients that are subscribed to the order log event
 * @param auth the {@link AuthPacket}
 * @param update_query the {@link OrderLogUpdate}
 * @returns void
 */
export async function orderLogUpdate(auth: AuthPacket, update_query: OrderLogUpdate) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const updatedOrderLog = await prisma.order_Log.update(update_query);
        const orders = await prisma.order_Log.findMany();
        io.emit("orderLog", orders);
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that deletes an order log, sends a broadcast to all clients that are subscribed to the order log event
 * @param auth the {@link AuthPacket}
 * @param delete_query the {@link OrderLogDelete}
 * @returns void
 */
export async function orderLogDelete(auth: AuthPacket, delete_query: OrderLogDelete) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        await prisma.order_Log.delete(delete_query);
        io.emit("orderLog", await prisma.order_Log.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that creates a new user, sends a broadcast to all clients that are subscribed to the user event
 * @param auth the {@link AuthPacket}
 * @param create_query the {@link UsersCreate}
 * @returns void
 */
export async function usersCreate(auth: AuthPacket, create_query: UsersCreate) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const newUser = await prisma.users.create(create_query);
        io.emit("users", await prisma.users.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that reads all users, sends a callback to the client
 * @param read_query the {@link UsersRead}
 * @param callback the callback function
 * @returns void
 */
export async function usersRead(read_query: UsersRead, callback: any) {
    try {
        callback(await prisma.users.findMany(read_query || {}));
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that updates a user, sends a broadcast to all clients that are subscribed to the user event
 * @param auth the {@link AuthPacket}
 * @param update_query the {@link UsersUpdate}
 * @returns void
 */
export async function usersUpdate(auth: AuthPacket, update_query: UsersUpdate) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const updatedUser = await prisma.users.update(update_query);
        io.emit("users", await prisma.users.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that deletes a user, sends a broadcast to all clients that are subscribed to the user event
 * @param auth the {@link AuthPacket}
 * @param delete_query the {@link UsersDelete}
 * @returns void
 */
export async function usersDelete(auth: AuthPacket, delete_query: UsersDelete) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        await prisma.users.delete(delete_query);
        io.emit("users", await prisma.users.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that creates a new kitchen cart
 * @param create_query the {@link KitchenCreate}
 * @returns void
 */
export async function kitchenCreate(create_query: KitchenCreate) {
    try {
        const newKitchen = await prisma.kitchen.create(create_query);
        io.emit("kitchen", await prisma.kitchen.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that reads all kitchen carts
 * @param read_query the {@link KitchenRead}
 * @param callback the callback function
 * @returns void
 */
export async function kitchenRead(read_query: KitchenRead, callback: any) {
    try {
        callback(await prisma.kitchen.findMany(read_query || {}));
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that updates a kitchen cart
 * @param auth the {@link AuthPacket}
 * @param update_query the {@link KitchenUpdate}
 * @returns void
 */
export async function kitchenUpdate(auth: AuthPacket, update_query: KitchenUpdate) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const updatedKitchen = await prisma.kitchen.update(update_query);
        io.emit("kitchen", await prisma.kitchen.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that deletes a kitchen cart
 * @param auth the {@link AuthPacket}
 * @param delete_query the {@link KitchenDelete}
 * @returns void
 */
export async function kitchenDelete(auth: AuthPacket, delete_query: KitchenDelete) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        await prisma.kitchen.deleteMany(delete_query);
        io.emit("kitchen", await prisma.kitchen.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that translates a JSON object to a specified language
 * @param obj the object to be translated
 * @param to the language to be translated to
 * @param callback the callback function
 */
export async function translateJSON(obj: { [key: string]: string }, to: string, callback: any) {
    try {
        const translated = await translate(obj, { to: to }) as { [x: string]: googleTranslateApi.TranslationResponse; };
        for (const key in obj) {
            obj[key] = translated[key].text;
        }
        callback(obj);
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

/**
 * Route that translates an array of strings to a specified language
 * @param arr the array to be translated
 * @param to the language to be translated to
 * @param callback the callback function
 */
export async function translateArray(arr: string[], to: string, callback: any) {
    try {
        const translated = await translate(arr, { to: to }) as googleTranslateApi.TranslationResponse[];
        for (let i = 0; i < arr.length; i++) {
            arr[i] = translated[i].text;
        }
        callback(arr);
    } catch (error) {
        console.error("ERROR: " + error);
    }
}


export function setupListen() {
    io.on("connect", (socket) => {
        console.log("Connected: " + socket.id);
        socket.on("ingredient:create", ingredientCreate);
        socket.on("ingredient:read", ingredientRead);
        socket.on("ingredient:update", ingredientUpdate);
        socket.on("ingredient:delete", ingredientDelete);
        socket.on("ingredientMenu:create", ingredientsMenuCreate);
        socket.on("ingredientMenu:read", ingredientsMenuRead);
        socket.on("ingredientMenu:update", ingredientsMenuUpdate);
        socket.on("ingredientMenu:delete", ingredientsMenuDelete);
        socket.on("loginLog:create", loginLogCreate);
        socket.on("loginLog:read", loginLogRead);
        socket.on("loginLog:update", loginLogUpdate);
        socket.on("loginLog:delete", loginLogDelete);
        socket.on("menuItem:create", menuItemCreate);
        socket.on("menuItem:add", menuItemAdd);
        socket.on("menuItem:read", menuItemRead);
        socket.on("menuItem:update", menuItemUpdate);
        socket.on("menuItem:delete", menuItemDelete);
        socket.on("menuItem:clear", menuItemClear);
        socket.on("orderLog:create", orderLogCreate);
        socket.on("orderLog:read", orderLogRead);
        socket.on("orderLog:update", orderLogUpdate);
        socket.on("orderLog:delete", orderLogDelete);
        socket.on("users:create", usersCreate);
        socket.on("users:read", usersRead);
        socket.on("users:update", usersUpdate);
        socket.on("users:delete", usersDelete);
        socket.on("kitchen:create", kitchenCreate);
        socket.on("kitchen:read", kitchenRead);
        socket.on("kitchen:update", kitchenUpdate);
        socket.on("kitchen:delete", kitchenDelete);
        socket.on("translateJSON", translateJSON);
        socket.on("translateArray", translateArray);
        socket.onAny((event, ...args) => {
            console.log("Event: " + event);
        });
        socket.on("disconnect", (reason) => {
            console.log("Disconnected: " + socket.id + " (" + reason + ")");
        });
    });

    io.on("disconnect", (socket) => {
        console.log("Disconnected: " + socket.id);
    });
}

export function setupTestListen(io: any) {
    io.on("connect", (socket: any) => {
        console.log("Connected: " + socket.id);
        socket.on("ingredient:create", ingredientCreate);
        socket.on("ingredient:read", ingredientRead);
        socket.on("ingredient:update", ingredientUpdate);
        socket.on("ingredient:delete", ingredientDelete);
        socket.on("ingredientMenu:create", ingredientsMenuCreate);
        socket.on("ingredientMenu:read", ingredientsMenuRead);
        socket.on("ingredientMenu:update", ingredientsMenuUpdate);
        socket.on("ingredientMenu:delete", ingredientsMenuDelete);
        socket.on("loginLog:create", loginLogCreate);
        socket.on("loginLog:read", loginLogRead);
        socket.on("loginLog:update", loginLogUpdate);
        socket.on("loginLog:delete", loginLogDelete);
        socket.on("menuItem:create", menuItemCreate);
        socket.on("menuItem:add", menuItemAdd);
        socket.on("menuItem:read", menuItemRead);
        socket.on("menuItem:update", menuItemUpdate);
        socket.on("menuItem:delete", menuItemDelete);
        socket.on("menuItem:clear", menuItemClear);
        socket.on("orderLog:create", orderLogCreate);
        socket.on("orderLog:read", orderLogRead);
        socket.on("orderLog:update", orderLogUpdate);
        socket.on("orderLog:delete", orderLogDelete);
        socket.on("users:create", usersCreate);
        socket.on("users:read", usersRead);
        socket.on("users:update", usersUpdate);
        socket.on("users:delete", usersDelete);
        socket.on("kitchen:create", kitchenCreate);
        socket.on("kitchen:read", kitchenRead);
        socket.on("kitchen:update", kitchenUpdate);
        socket.on("kitchen:delete", kitchenDelete);
        socket.on("translateJSON", translateJSON);
        socket.on("translateArray", translateArray);
        socket.onAny((event: any, ...args: any) => {
            console.log("Event: " + event);
        });
        socket.on("disconnect", (reason: any) => {
            console.log("Disconnected: " + socket.id + " (" + reason + ")");
        });
    });

    io.on("disconnect", (socket: any) => {
        console.log("Disconnected: " + socket.id);
    });
}
