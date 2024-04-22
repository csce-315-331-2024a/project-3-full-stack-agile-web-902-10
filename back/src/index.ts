import { Server } from "socket.io";
import translate, { googleTranslateApi } from "google-translate-api-x";

import {
    PrismaClient,
    Ingredient,
    Ingredients_Menu,
    Login_Log,
    Menu_Item,
    Order_Log,
    Users,
} from "@prisma/client";

const io = new Server({
    cors: {
        origin: "*",
    },
});
const prisma = new PrismaClient();

type AuthPacket = {
    email: string;
    jwt: string;
}
type IngredientCreateQuery = Parameters<typeof prisma.ingredient.create>[0];
type IngredientReadQuery = Parameters<typeof prisma.ingredient.findMany>[0];
type IngredientUpdateQuery = Parameters<typeof prisma.ingredient.update>[0];
type IngredientDeleteQuery = Parameters<typeof prisma.ingredient.delete>[0];
type IngredientsMenuCreate = Parameters<typeof prisma.ingredients_Menu.create>[0];
type IngredientsMenuRead = Parameters<typeof prisma.ingredients_Menu.findMany>[0];
type IngredientsMenuUpdate = Parameters<typeof prisma.ingredients_Menu.update>[0];
type IngredientsMenuDelete = Parameters<typeof prisma.ingredients_Menu.delete>[0];
type LoginLogCreate = Parameters<typeof prisma.login_Log.create>[0];
type LoginLogRead = Parameters<typeof prisma.login_Log.findMany>[0];
type LoginLogUpdate = Parameters<typeof prisma.login_Log.update>[0];
type LoginLogDelete = Parameters<typeof prisma.login_Log.delete>[0];
type MenuItemCreate = Parameters<typeof prisma.menu_Item.create>[0];
type MenuItemRead = Parameters<typeof prisma.menu_Item.findMany>[0];
type MenuItemUpdate = Parameters<typeof prisma.menu_Item.update>[0];
type MenuItemDelete = Parameters<typeof prisma.menu_Item.delete>[0];
type OrderLogCreate = Parameters<typeof prisma.order_Log.create>[0];
type OrderLogRead = Parameters<typeof prisma.order_Log.findMany>[0];
type OrderLogUpdate = Parameters<typeof prisma.order_Log.update>[0];
type OrderLogDelete = Parameters<typeof prisma.order_Log.delete>[0];
type UsersCreate = Parameters<typeof prisma.users.create>[0];
type UsersRead = Parameters<typeof prisma.users.findMany>[0];
type UsersUpdate = Parameters<typeof prisma.users.update>[0];
type UsersDelete = Parameters<typeof prisma.users.delete>[0];

async function verifyToken(email: string, jwt: string): Promise<boolean> {
    const users = await prisma.users.findMany();
    return users.some((user) => {
        return user.email === email && user.jwt === jwt;
    });
}


async function ingredientCreate(auth: AuthPacket, create_query: IngredientCreateQuery) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const newIngredient = await prisma.ingredient.create(create_query);
        io.emit("ingredient", await prisma.ingredient.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

async function ingredientRead(read_query: IngredientReadQuery, callback: any) {
    try {
        callback(await prisma.ingredient.findMany(read_query || {}));
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

async function ingredientUpdate(auth: AuthPacket, update_query: IngredientUpdateQuery) {
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

async function ingredientDelete(auth: AuthPacket, delete_query: IngredientDeleteQuery) {
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

async function ingredientsMenuCreate(auth: AuthPacket, create_query: IngredientsMenuCreate) {
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

async function ingredientsMenuRead(read_query: IngredientsMenuRead, callback: any) {
    try {
        callback(await prisma.ingredients_Menu.findMany(read_query || {}));
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

async function ingredientsMenuUpdate(auth: AuthPacket, update_query: IngredientsMenuUpdate) {
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

async function ingredientsMenuDelete(auth: AuthPacket, delete_query: IngredientsMenuDelete) {
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

async function loginLogCreate(auth: AuthPacket, create_query: LoginLogCreate) {
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

async function loginLogRead(read_query: LoginLogRead, callback: any) {
    try {
        callback(await prisma.login_Log.findMany(read_query || {}));
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

async function loginLogUpdate(auth: AuthPacket, update_query: LoginLogUpdate) {
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

async function loginLogDelete(auth: AuthPacket, delete_query: LoginLogDelete) {
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

async function menuItemCreate(auth: AuthPacket, create_query: MenuItemCreate) {
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

async function menuItemRead(read_query: MenuItemRead, callback: any) {
    try {
        callback(await prisma.menu_Item.findMany(read_query || {}));
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

async function menuItemUpdate(auth: AuthPacket, update_query: MenuItemUpdate) {
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

async function menuItemAdd(auth: AuthPacket, menu_item: Menu_Item, ingredients: Ingredient[], ratios: number[], callback: any) {
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
                is_active : menu_item.is_active,
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
    
    } catch (error) {
        console.error("ERROR: " + error);
        callback(error);
    }
}

async function menuItemDelete(auth: AuthPacket, delete_query: MenuItemDelete) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        await prisma.menu_Item.delete(delete_query);
        io.emit("menuItem", await prisma.menu_Item.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

async function orderLogCreate(auth: AuthPacket, create_query: OrderLogCreate) {
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

async function orderLogRead(read_query: OrderLogRead, callback: any) {
    try {
        callback(await prisma.order_Log.findMany(read_query || {}));
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

async function orderLogUpdate(auth: AuthPacket, update_query: OrderLogUpdate) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const updatedOrderLog = await prisma.order_Log.update(update_query);
        io.emit("orderLog", await prisma.order_Log.findMany());
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

async function orderLogDelete(auth: AuthPacket, delete_query: OrderLogDelete) {
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

async function usersCreate(auth: AuthPacket, create_query: UsersCreate) {
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

async function usersRead(read_query: UsersRead, callback: any) {
    try {
        callback(await prisma.users.findMany(read_query || {}));
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

async function usersUpdate(auth: AuthPacket, update_query: UsersUpdate) {
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

async function usersDelete(auth: AuthPacket, delete_query: UsersDelete) {
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

async function translateJSON(obj: { [key: string]: string }, to: string, callback: any) {
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

async function translateArray(arr: string[], to: string, callback: any) {
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
async function verifyCartAndCreateOrder(packet: string) {
    const cart = JSON.parse(packet) as CartItem[];
}

io.on("connect", (socket) => {
    console.log("Connected: " + socket.id);
    socket.on("ingredient:create", ingredientCreate);
    socket.on("ingredient:read", ingredientRead);
    socket.on("ingredient:update", ingredientUpdate);
    socket.on("ingredient:delete", ingredientDelete);
    socket.on("ingredientsMenu:create", ingredientsMenuCreate);
    socket.on("ingredientsMenu:read", ingredientsMenuRead);
    socket.on("ingredientsMenu:update", ingredientsMenuUpdate);
    socket.on("ingredientsMenu:delete", ingredientsMenuDelete);
    socket.on("loginLog:create", loginLogCreate);
    socket.on("loginLog:read", loginLogRead);
    socket.on("loginLog:update", loginLogUpdate);
    socket.on("loginLog:delete", loginLogDelete);
    socket.on("menuItem:create", menuItemCreate);
    socket.on("menuItem:add", menuItemAdd);
    socket.on("menuItem:read", menuItemRead);
    socket.on("menuItem:update", menuItemUpdate);
    socket.on("menuItem:delete", menuItemDelete);
    socket.on("orderLog:create", orderLogCreate);
    socket.on("orderLog:read", orderLogRead);
    socket.on("orderLog:update", orderLogUpdate);
    socket.on("orderLog:delete", orderLogDelete);
    socket.on("users:create", usersCreate);
    socket.on("users:read", usersRead);
    socket.on("users:update", usersUpdate);
    socket.on("users:delete", usersDelete);
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

try {
    if (process.env.PORT) {
        io.listen(parseInt(process.env.PORT));
        console.log("Listening on port" + process.env.PORT);
    }
    else {
        io.listen(5000);
        console.log("Listening on port 5000");
    }
} catch (error) {
    console.error(error);
}