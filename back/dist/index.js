"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const google_translate_api_x_1 = __importDefault(require("google-translate-api-x"));
const client_1 = require("@prisma/client");
const io = new socket_io_1.Server({
    cors: {
        origin: "*",
    },
});
const prisma = new client_1.PrismaClient();
async function verifyToken(email, jwt) {
    const users = await prisma.users.findMany();
    return users.some((user) => {
        return user.email === email && user.jwt === jwt;
    });
}
async function ingredientCreate(auth, create_query) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const newIngredient = await prisma.ingredient.create(create_query);
        io.emit("ingredient", await prisma.ingredient.findMany());
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function ingredientRead(read_query, callback) {
    try {
        callback(await prisma.ingredient.findMany(read_query || {}));
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function ingredientUpdate(auth, update_query) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const updatedIngredient = await prisma.ingredient.update(update_query);
        io.emit("ingredient", await prisma.ingredient.findMany());
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function ingredientDelete(auth, delete_query) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        await prisma.ingredient.delete(delete_query);
        io.emit("ingredient", await prisma.ingredient.findMany());
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function ingredientsMenuCreate(auth, create_query) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const newIngredientsMenu = await prisma.ingredients_Menu.create(create_query);
        io.emit("ingredientsMenu", await prisma.ingredients_Menu.findMany());
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function ingredientsMenuRead(read_query, callback) {
    try {
        callback(await prisma.ingredients_Menu.findMany(read_query || {}));
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function ingredientsMenuUpdate(auth, update_query) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const updatedIngredientsMenu = await prisma.ingredients_Menu.update(update_query);
        io.emit("ingredientsMenu", await prisma.ingredients_Menu.findMany());
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function ingredientsMenuDelete(auth, delete_query) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        await prisma.ingredients_Menu.delete(delete_query);
        io.emit("ingredientsMenu", await prisma.ingredients_Menu.findMany());
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function loginLogCreate(auth, create_query) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const newLoginLog = await prisma.login_Log.create(create_query);
        io.emit("loginLog", await prisma.login_Log.findMany());
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function loginLogRead(read_query, callback) {
    try {
        callback(await prisma.login_Log.findMany(read_query || {}));
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function loginLogUpdate(auth, update_query) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const updatedLoginLog = await prisma.login_Log.update(update_query);
        io.emit("loginLog", await prisma.login_Log.findMany());
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function loginLogDelete(auth, delete_query) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        await prisma.login_Log.delete(delete_query);
        io.emit("loginLog", await prisma.login_Log.findMany());
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function menuItemCreate(auth, create_query) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const newMenuItem = await prisma.menu_Item.create(create_query);
        io.emit("menuItem", await prisma.menu_Item.findMany());
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function menuItemRead(read_query, callback) {
    try {
        callback(await prisma.menu_Item.findMany(read_query || {}));
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function menuItemUpdate(auth, update_query) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const updatedMenuItem = await prisma.menu_Item.update(update_query);
        io.emit("menuItem", await prisma.menu_Item.findMany());
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function menuItemDelete(auth, delete_query) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        await prisma.menu_Item.delete(delete_query);
        io.emit("menuItem", await prisma.menu_Item.findMany());
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function orderLogCreate(auth, create_query) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const newOrderLog = await prisma.order_Log.create(create_query);
        io.emit("orderLog", await prisma.order_Log.findMany());
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function orderLogRead(read_query, callback) {
    try {
        callback(await prisma.order_Log.findMany(read_query || {}));
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function orderLogUpdate(auth, update_query) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const updatedOrderLog = await prisma.order_Log.update(update_query);
        io.emit("orderLog", await prisma.order_Log.findMany());
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function orderLogDelete(auth, delete_query) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        await prisma.order_Log.delete(delete_query);
        io.emit("orderLog", await prisma.order_Log.findMany());
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function usersCreate(auth, create_query) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const newUser = await prisma.users.create(create_query);
        io.emit("users", await prisma.users.findMany());
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function usersRead(read_query, callback) {
    try {
        callback(await prisma.users.findMany(read_query || {}));
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function usersUpdate(auth, update_query) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        const updatedUser = await prisma.users.update(update_query);
        io.emit("users", await prisma.users.findMany());
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function usersDelete(auth, delete_query) {
    try {
        if (!verifyToken(auth.email, auth.jwt)) {
            return;
        }
        await prisma.users.delete(delete_query);
        io.emit("users", await prisma.users.findMany());
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function translateJSON(obj, to, callback) {
    try {
        const translated = await (0, google_translate_api_x_1.default)(obj, { to: to });
        for (const key in obj) {
            obj[key] = translated[key].text;
        }
        callback(obj);
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function translateArray(arr, to, callback) {
    try {
        const translated = await (0, google_translate_api_x_1.default)(arr, { to: to });
        for (let i = 0; i < arr.length; i++) {
            arr[i] = translated[i].text;
        }
        callback(arr);
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function verifyCartAndCreateOrder(packet) {
    const cart = JSON.parse(packet);
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
}
catch (error) {
    console.error(error);
}
