import {
    Ingredient,
    Ingredients_Menu,
    Login_Log,
    Menu_Item,
    Order_Log,
    Users,
    Order_Status,
    Roles,
} from "@prisma/client";

import translate, { googleTranslateApi } from "google-translate-api-x";
import prisma from "./client";
import { io } from "./socket";

export type AuthPacket = {
    email: string;
    jwt: string;
}
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

        return false;
    } catch (error) {
        console.error("ERROR: " + error);
        return false;
    }
}


export async function ingredientCreate(auth: AuthPacket, create_query: IngredientCreate) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return 0;
        }
        const newIngredient = await prisma.ingredient.create(create_query);
        io.emit("ingredient", await prisma.ingredient.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

export async function ingredientRead(read_query: IngredientRead, callback: any) {
    try {
        callback(await prisma.ingredient.findMany(read_query || {}));
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

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

export async function ingredientsMenuRead(read_query: IngredientsMenuRead, callback: any) {
    try {
        callback(await prisma.ingredients_Menu.findMany(read_query || {}));
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

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

export async function loginLogRead(read_query: LoginLogRead, callback: any) {
    try {
        callback(await prisma.login_Log.findMany(read_query || {}));
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

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

export async function menuItemRead(read_query: MenuItemRead, callback: any) {
    try {
        callback(await prisma.menu_Item.findMany(read_query || {}));
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

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

export async function orderLogRead(read_query: OrderLogRead, callback: any) {
    try {
        callback(await prisma.order_Log.findMany(read_query || {}));
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

export async function orderLogUpdate(auth: AuthPacket, update_query: OrderLogUpdate) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const updatedOrderLog = await prisma.order_Log.update(update_query);
        const orders = await prisma.order_Log.findMany({
            where: {
                status: {
                    not: Order_Status.Completed,
                }
            },
        });
        io.emit("orderLog", orders);
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

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

export async function usersRead(read_query: UsersRead, callback: any) {
    try {
        callback(await prisma.users.findMany(read_query || {}));
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

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

// Custom events for edge cases
type CartItem = Menu_Item & { quantity: number };
export async function verifyCartAndCreateOrder(packet: string) {
    const cart = JSON.parse(packet) as CartItem[];
}