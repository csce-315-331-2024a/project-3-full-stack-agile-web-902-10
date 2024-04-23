import { io } from "./socket";
import * as routes from "./routes";


io.on("connect", (socket) => {
    console.log("Connected: " + socket.id);
    socket.on("ingredient:create", routes.ingredientCreate);
    socket.on("ingredient:read", routes.ingredientRead);
    socket.on("ingredient:update", routes.ingredientUpdate);
    socket.on("ingredient:delete", routes.ingredientDelete);
    socket.on("ingredientMenu:create", routes.ingredientsMenuCreate);
    socket.on("ingredientMenu:read", routes.ingredientsMenuRead);
    socket.on("ingredientMenu:update", routes.ingredientsMenuUpdate);
    socket.on("ingredientMenu:delete", routes.ingredientsMenuDelete);
    socket.on("loginLog:create", routes.loginLogCreate);
    socket.on("loginLog:read", routes.loginLogRead);
    socket.on("loginLog:update", routes.loginLogUpdate);
    socket.on("loginLog:delete", routes.loginLogDelete);
    socket.on("menuItem:create", routes.menuItemCreate);
    socket.on("menuItem:add", routes.menuItemAdd);
    socket.on("menuItem:read", routes.menuItemRead);
    socket.on("menuItem:update", routes.menuItemUpdate);
    socket.on("menuItem:delete", routes.menuItemDelete);
    socket.on("orderLog:create", routes.orderLogCreate);
    socket.on("orderLog:read", routes.orderLogRead);
    socket.on("orderLog:update", routes.orderLogUpdate);
    socket.on("orderLog:delete", routes.orderLogDelete);
    socket.on("users:create", routes.usersCreate);
    socket.on("users:read", routes.usersRead);
    socket.on("users:update", routes.usersUpdate);
    socket.on("users:delete", routes.usersDelete);
    socket.on("translateJSON", routes.translateJSON);
    socket.on("translateArray", routes.translateArray);
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