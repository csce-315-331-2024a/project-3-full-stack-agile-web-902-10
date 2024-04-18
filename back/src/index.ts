import { Server } from "socket.io";
import { 
    PrismaClient, 
    Ingredient, 
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

var cachedIngredients: Ingredient[] = [];
var cachedLoginLogs: Login_Log[] = [];
var cachedMenuItems: Menu_Item[] = [];
var cachedOrderLogs: Order_Log[] = [];
var cachedUsers: Users[] = [];

async function cacheData() {
    cachedIngredients = await prisma.ingredient.findMany();
    cachedLoginLogs = await prisma.login_Log.findMany();
    cachedMenuItems = await prisma.menu_Item.findMany();
    cachedOrderLogs = await prisma.order_Log.findMany();
    cachedUsers = await prisma.users.findMany();
}
cacheData();

type AuthPacket<T> = {
    email: string;
    jwt: string;
    data: T;
}

function verifyToken(email: string, jwt: string): boolean {
    return cachedUsers.some((user) => {
        return user.email === email && user.jwt === jwt;
    });
}

async function ingredientCreate(packet: string) {
    const ingredient = JSON.parse(packet) as AuthPacket<Ingredient>;
    if (!verifyToken(ingredient.email, ingredient.jwt)) {
        return;
    }

    const newIngredient = await prisma.ingredient.create({
        data: ingredient.data,
    });

    cachedIngredients.push(newIngredient);
    io.emit("ingredient", JSON.stringify(cachedIngredients));
}

async function ingredientRead(packet: string) {
    io.emit("ingredient", JSON.stringify(cachedIngredients));
}

async function ingredientUpdate(packet: string) {
    const ingredient = JSON.parse(packet) as AuthPacket<Ingredient>;
    if (!verifyToken(ingredient.email, ingredient.jwt)) {
        return;
    }

    const updatedIngredient = await prisma.ingredient.update({
        where: { id: ingredient.data.id },
        data: ingredient.data,
    });

    const index = cachedIngredients.findIndex((i) => i.id === updatedIngredient.id);
    cachedIngredients[index] = updatedIngredient;
    io.emit("ingredient", JSON.stringify(cachedIngredients));
}

async function ingredientDelete(packet: string) {
    const ingredient = JSON.parse(packet) as AuthPacket<Ingredient>;
    if (!verifyToken(ingredient.email, ingredient.jwt)) {
        return;
    }

    await prisma.ingredient.delete({
        where: { id: ingredient.data.id },
    });

    cachedIngredients = cachedIngredients.filter((i) => i.id !== ingredient.data.id);
    io.emit("ingredient", JSON.stringify(cachedIngredients));
}

async function loginLogCreate(packet: string) {
    const loginLog = JSON.parse(packet) as AuthPacket<Login_Log>;
    if (!verifyToken(loginLog.email, loginLog.jwt)) {
        return;
    }

    const newLoginLog = await prisma.login_Log.create({
        data: loginLog.data,
    });

    cachedLoginLogs.push(newLoginLog);
    io.emit("loginLog", JSON.stringify(cachedLoginLogs));
}

async function loginLogRead(packet: string) {
    io.emit("loginLog", JSON.stringify(cachedLoginLogs));
}

async function loginLogUpdate(packet: string) {
    const loginLog = JSON.parse(packet) as AuthPacket<Login_Log>;
    if (!verifyToken(loginLog.email, loginLog.jwt)) {
        return;
    }

    const updatedLoginLog = await prisma.login_Log.update({
        where: { id: loginLog.data.id },
        data: loginLog.data,
    });

    const index = cachedLoginLogs.findIndex((i) => i.id === updatedLoginLog.id);
    cachedLoginLogs[index] = updatedLoginLog;
    io.emit("loginLog", JSON.stringify(cachedLoginLogs));
}

async function loginLogDelete(packet: string) {
    const loginLog = JSON.parse(packet) as AuthPacket<Login_Log>;
    if (!verifyToken(loginLog.email, loginLog.jwt)) {
        return;
    }

    await prisma.login_Log.delete({
        where: { id: loginLog.data.id },
    });

    cachedLoginLogs = cachedLoginLogs.filter((i) => i.id !== loginLog.data.id);
    io.emit("loginLog", JSON.stringify(cachedLoginLogs));
}

async function menuItemCreate(packet: string) {
    const menuItem = JSON.parse(packet) as AuthPacket<Menu_Item>;
    if (!verifyToken(menuItem.email, menuItem.jwt)) {
        return;
    }

    const newMenuItem = await prisma.menu_Item.create({
        data: menuItem.data,
    });

    cachedMenuItems.push(newMenuItem);
    io.emit("menuItem", JSON.stringify(cachedMenuItems));
}

async function menuItemRead(packet: string) {
    io.emit("menuItem", JSON.stringify(cachedMenuItems));
}

async function menuItemUpdate(packet: string) {
    const menuItem = JSON.parse(packet) as AuthPacket<Menu_Item>;
    if (!verifyToken(menuItem.email, menuItem.jwt)) {
        return;
    }

    const updatedMenuItem = await prisma.menu_Item.update({
        where: { id: menuItem.data.id },
        data: menuItem.data,
    });

    const index = cachedMenuItems.findIndex((i) => i.id === updatedMenuItem.id);
    cachedMenuItems[index] = updatedMenuItem;
    io.emit("menuItem", JSON.stringify(cachedMenuItems));
}

async function menuItemDelete(packet: string) {
    const menuItem = JSON.parse(packet) as AuthPacket<Menu_Item>;
    if (!verifyToken(menuItem.email, menuItem.jwt)) {
        return;
    }

    await prisma.menu_Item.delete({
        where: { id: menuItem.data.id },
    });

    cachedMenuItems = cachedMenuItems.filter((i) => i.id !== menuItem.data.id);
    io.emit("menuItem", JSON.stringify(cachedMenuItems));
}

async function orderLogCreate(packet: string) {
    const orderLog = JSON.parse(packet) as AuthPacket<Order_Log>;
    await prisma.order_Log.create({
        data: orderLog.data,
    });

    cachedOrderLogs.push(orderLog.data);
    io.emit("orderLog", JSON.stringify(cachedOrderLogs));
}

async function orderLogRead(packet: string) {
    io.emit("orderLog", JSON.stringify(cachedOrderLogs));
}

async function orderLogUpdate(packet: string) {
    const orderLog = JSON.parse(packet) as AuthPacket<Order_Log>;
    if (!verifyToken(orderLog.email, orderLog.jwt)) {
        return;
    }

    const updatedOrderLog = await prisma.order_Log.update({
        where: { id: orderLog.data.id },
        data: orderLog.data,
    });

    const index = cachedOrderLogs.findIndex((i) => i.id === updatedOrderLog.id);
    cachedOrderLogs[index] = updatedOrderLog;
    io.emit("orderLog", JSON.stringify(cachedOrderLogs));
}

async function orderLogDelete(packet: string) {
    const orderLog = JSON.parse(packet) as AuthPacket<Order_Log>;
    if (!verifyToken(orderLog.email, orderLog.jwt)) {
        return;
    }

    await prisma.order_Log.delete({
        where: { id: orderLog.data.id },
    });

    cachedOrderLogs = cachedOrderLogs.filter((i) => i.id !== orderLog.data.id);
    io.emit("orderLog", JSON.stringify(cachedOrderLogs));
}

async function usersCreate(packet: string) {
    const user = JSON.parse(packet) as AuthPacket<Users>;
    if (!verifyToken(user.email, user.jwt)) {
        return;
    }

    const newUser = await prisma.users.create({
        data: user.data,
    });

    cachedUsers.push(newUser);
    io.emit("users", JSON.stringify(cachedUsers));
}

async function usersRead(packet: string) {
    io.emit("users", JSON.stringify(cachedUsers));
}

async function usersUpdate(packet: string) {
    const user = JSON.parse(packet) as AuthPacket<Users>;
    if (!verifyToken(user.email, user.jwt)) {
        return;
    }

    const updatedUser = await prisma.users.update({
        where: { id: user.data.id },
        data: user.data,
    });

    const index = cachedUsers.findIndex((i) => i.id === updatedUser.id);
    cachedUsers[index] = updatedUser;
    io.emit("users", JSON.stringify(cachedUsers));
}

async function usersDelete(packet: string) {
    const user = JSON.parse(packet) as AuthPacket<Users>;
    if (!verifyToken(user.email, user.jwt)) {
        return;
    }

    await prisma.users.delete({
        where: { id: user.data.id },
    });

    cachedUsers = cachedUsers.filter((i) => i.id !== user.data.id);
    io.emit("users", JSON.stringify(cachedUsers));
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

console.log("Listening on port 5000");
io.listen(5000);