"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const client_1 = require("@prisma/client");
const io = new socket_io_1.Server({
    cors: {
        origin: "*",
    },
});
const prisma = new client_1.PrismaClient();
var cachedIngredients = [];
var cachedIngredientsMenu = [];
var cachedLoginLogs = [];
var cachedMenuItems = [];
var cachedOrderLogs = [];
var cachedUsers = [];
async function cacheData() {
    cachedIngredients = await prisma.ingredient.findMany();
    cachedIngredientsMenu = await prisma.ingredients_Menu.findMany();
    cachedLoginLogs = await prisma.login_Log.findMany();
    cachedMenuItems = await prisma.menu_Item.findMany();
    cachedOrderLogs = await prisma.order_Log.findMany();
    cachedUsers = await prisma.users.findMany();
}
try {
    cacheData();
}
catch {
    console.log("Unable to cache data");
    process.exit(1);
}
function verifyToken(email, jwt) {
    return cachedUsers.some((user) => {
        return user.email === email && user.jwt === jwt;
    });
}
async function ingredientCreate(packet) {
    try {
        const ingredient = JSON.parse(packet);
        if (!verifyToken(ingredient.email, ingredient.jwt)) {
            return;
        }
        const newIngredient = await prisma.ingredient.create({
            ...ingredient.data,
        });
        cachedIngredients.push(newIngredient);
        io.emit("ingredient", JSON.stringify(cachedIngredients));
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
// Apply similar modifications to the other async functions
async function ingredientRead(packet) {
    try {
        return JSON.stringify(cachedIngredients);
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function ingredientUpdate(packet) {
    try {
        const ingredient = JSON.parse(packet);
        if (!verifyToken(ingredient.email, ingredient.jwt)) {
            return;
        }
        const updatedIngredient = await prisma.ingredient.update({
            ...ingredient.data,
        });
        const index = cachedIngredients.findIndex((i) => i.id === updatedIngredient.id);
        cachedIngredients[index] = updatedIngredient;
        io.emit("ingredient", JSON.stringify(cachedIngredients));
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function ingredientDelete(packet) {
    try {
        const ingredient = JSON.parse(packet);
        if (!verifyToken(ingredient.email, ingredient.jwt)) {
            return;
        }
        await prisma.ingredient.delete({
            ...ingredient.data,
        });
        cachedIngredients = cachedIngredients.filter((i) => i.id !== ingredient.data.id);
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function loginLogCreate(packet) {
    try {
        const loginLog = JSON.parse(packet);
        if (!verifyToken(loginLog.email, loginLog.jwt)) {
            return;
        }
        const newLoginLog = await prisma.login_Log.create({
            ...loginLog.data,
        });
        cachedLoginLogs.push(newLoginLog);
        io.emit("loginLog", JSON.stringify(cachedLoginLogs));
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function loginLogRead(packet) {
    try {
        return JSON.stringify(cachedLoginLogs);
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function loginLogUpdate(packet) {
    try {
        const loginLog = JSON.parse(packet);
        if (!verifyToken(loginLog.email, loginLog.jwt)) {
            return;
        }
        const updatedLoginLog = await prisma.login_Log.update({
            ...loginLog.data,
        });
        const index = cachedLoginLogs.findIndex((i) => i.id === updatedLoginLog.id);
        cachedLoginLogs[index] = updatedLoginLog;
        io.emit("loginLog", JSON.stringify(cachedLoginLogs));
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function loginLogDelete(packet) {
    try {
        const loginLog = JSON.parse(packet);
        if (!verifyToken(loginLog.email, loginLog.jwt)) {
            return;
        }
        await prisma.login_Log.delete({
            ...loginLog.data,
        });
        cachedLoginLogs = cachedLoginLogs.filter((i) => i.id !== loginLog.data.id);
        io.emit("loginLog", JSON.stringify(cachedLoginLogs));
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function menuItemCreate(packet) {
    try {
        const menuItem = JSON.parse(packet);
        if (!verifyToken(menuItem.email, menuItem.jwt)) {
            return;
        }
        const newMenuItem = await prisma.menu_Item.create({
            ...menuItem.data,
        });
        cachedMenuItems.push(newMenuItem);
        io.emit("menuItem", JSON.stringify(cachedMenuItems));
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function menuItemRead(packet) {
    try {
        return JSON.stringify(cachedMenuItems);
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function menuItemUpdate(packet) {
    try {
        const menuItem = JSON.parse(packet);
        if (!verifyToken(menuItem.email, menuItem.jwt)) {
            return;
        }
        const updatedMenuItem = await prisma.menu_Item.update({
            ...menuItem.data,
        });
        const index = cachedMenuItems.findIndex((i) => i.id === updatedMenuItem.id);
        cachedMenuItems[index] = updatedMenuItem;
        io.emit("menuItem", JSON.stringify(cachedMenuItems));
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function menuItemDelete(packet) {
    try {
        const menuItem = JSON.parse(packet);
        if (!verifyToken(menuItem.email, menuItem.jwt)) {
            return;
        }
        await prisma.menu_Item.delete({
            ...menuItem.data,
        });
        cachedMenuItems = cachedMenuItems.filter((i) => i.id !== menuItem.data.id);
        io.emit("menuItem", JSON.stringify(cachedMenuItems));
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function orderLogCreate(packet) {
    try {
        const orderLog = JSON.parse(packet);
        await prisma.order_Log.create({
            ...orderLog.data,
        });
        cachedOrderLogs.push(orderLog.data);
        io.emit("orderLog", JSON.stringify(cachedOrderLogs));
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function orderLogRead(packet) {
    try {
        return JSON.stringify(cachedOrderLogs);
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function orderLogUpdate(packet) {
    try {
        const orderLog = JSON.parse(packet);
        if (!verifyToken(orderLog.email, orderLog.jwt)) {
            return;
        }
        const updatedOrderLog = await prisma.order_Log.update({
            ...orderLog.data,
        });
        const index = cachedOrderLogs.findIndex((i) => i.id === updatedOrderLog.id);
        cachedOrderLogs[index] = updatedOrderLog;
        io.emit("orderLog", JSON.stringify(cachedOrderLogs));
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function orderLogDelete(packet) {
    try {
        const orderLog = JSON.parse(packet);
        if (!verifyToken(orderLog.email, orderLog.jwt)) {
            return;
        }
        await prisma.order_Log.delete({
            ...orderLog.data,
        });
        cachedOrderLogs = cachedOrderLogs.filter((i) => i.id !== orderLog.data.id);
        io.emit("orderLog", JSON.stringify(cachedOrderLogs));
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function usersCreate(packet) {
    try {
        const user = JSON.parse(packet);
        if (!verifyToken(user.email, user.jwt)) {
            return;
        }
        const newUser = await prisma.users.create({
            ...user.data,
        });
        cachedUsers.push(newUser);
        io.emit("users", JSON.stringify(cachedUsers));
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function usersRead(packet) {
    try {
        return JSON.stringify(cachedUsers);
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function usersUpdate(packet) {
    try {
        const user = JSON.parse(packet);
        if (!verifyToken(user.email, user.jwt)) {
            return;
        }
        const updatedUser = await prisma.users.update({
            ...user.data,
        });
        const index = cachedUsers.findIndex((i) => i.id === updatedUser.id);
        cachedUsers[index] = updatedUser;
        io.emit("users", JSON.stringify(cachedUsers));
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function usersDelete(packet) {
    try {
        const user = JSON.parse(packet);
        if (!verifyToken(user.email, user.jwt)) {
            return;
        }
        await prisma.users.delete({
            ...user.data,
        });
        cachedUsers = cachedUsers.filter((i) => i.id !== user.data.id);
        io.emit("users", JSON.stringify(cachedUsers));
    }
    catch (error) {
        console.error("ERROR: " + error);
    }
}
async function verifyCartAndCreateOrder(packet) {
    const cart = JSON.parse(packet);
    // decrement stock
    for (const cartItem of cart) {
        const menuItemIngredients = cachedIngredientsMenu.filter(i => i.menu_id === cartItem.id);
        for (const item of menuItemIngredients) {
            const requiredQuantity = item.quantity * cartItem.quantity; // item.quantity from ingredients_menu_item multiplied by the quantity in the cart
            const ingredientInStock = cachedIngredients.find(ing => ing.id === item.ingredients_id);
            if (!ingredientInStock || ingredientInStock.stock < requiredQuantity) {
                return;
            }
        }
    }
    for (const cartItem of cart) {
        const menuItemIngredients = cachedIngredientsMenu.filter(i => i.menu_id === cartItem.id);
        for (const item of menuItemIngredients) {
            const requiredQuantity = item.quantity * cartItem.quantity; // item.quantity from ingredients_menu_item multiplied by the quantity in the cart
            const ingredientInStock = cachedIngredients.find(ing => ing.id === item.ingredients_id);
            if (!ingredientInStock || ingredientInStock.stock < requiredQuantity) {
                return;
            }
            await prisma.ingredient.update({
                where: { id: item.ingredients_id },
                data: { stock: ingredientInStock.stock - requiredQuantity },
            });
        }
    }
    // create order, where price is the total price, menu_items is an array of menu_item ids with duplicates for quantity, and ingredients with ids, with duplicates for quantity
    let order = {
        price: cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0),
        menu_items: (cart.flatMap((item) => Array(item.quantity).fill(item.id))).toString(),
        ingredients: (cart.flatMap((item) => cachedIngredientsMenu.filter(i => i.menu_id === item.id).flatMap(i => Array(i.quantity * item.quantity).fill(i.ingredients_id)))).toString(),
    };
    await prisma.order_Log.create({ data: order });
    // let isStockSufficient = true;
    // let insufficientItems = [];
    // for (const cartItem of cart) {
    //     const menuItemIngredients = cachedIngredientsMenu.filter(i => i.menu_id === cartItem.id);
    //     for (const item of menuItemIngredients) {
    //         const requiredQuantity = item.quantity * cartItem.quantity; // item.quantity from ingredients_menu_item multiplied by the quantity in the cart
    //         const ingredientInStock = cachedIngredients.find(ing => ing.id === item.ingredients_id);
    //         if (!ingredientInStock || ingredientInStock.stock < requiredQuantity) {
    //             isStockSufficient = false;
    //             insufficientItems.push(`${ingredientInStock ? ingredientInStock.name : 'Unknown ingredient'} for ${cartItem.name}`);
    //             break;
    //         }
    //     }
    //     if (!isStockSufficient) {
    //         break;
    //     }
    // }
    // if (!isStockSufficient) {
    //     return;
    // }
    // for (const cartItem of cart) {
    //     const menuItemIngredients = cachedIngredientsMenu.filter(i => i.menu_id === cartItem.id);
    //     for (const item of menuItemIngredients) {
    //         const requiredQuantity = item.quantity * cartItem.quantity; // item.quantity from ingredients_menu_item multiplied by the quantity in the cart
    //         const ingredientInStock = cachedIngredients.find(ing => ing.id === item.ingredients_id);
    //         await prisma.ingredient.update({
    //             where: { id: item.ingredients_id },
    //             data: { stock: ingredientInStock.stock - requiredQuantity },
    //         });
    //     }
    // }
}
io.on("connect", (socket) => {
    console.log("Connected: " + socket.id);
    socket.on("ingredient:create", ingredientCreate);
    socket.on("ingredient:read", ingredientRead);
    socket.on("ingredient:update", ingredientUpdate);
    socket.on("ingredient:delete", ingredientDelete);
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
