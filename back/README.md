# Socket IO Backend

## Preface

Instead of using the traditional REST api of even something like tRPC, 
the fastest and easiest method was WebSockets. We were already looking
into them for having client's be updated when the databse was modified.
However it turned out to be a very pleasant experience for even simple
data fetching.

## Server setup

After insuring all the dependencies are installed,
run `npm run build` and `npm run start`, this will
build and run the server.

## Sending data to the server

You can send data to the server by emitting events. For instance, to 
create a new ingredient or log in a user, you would emit respective 
events as defined on the server:
```ts
const auth: AuthPacket = {
    email: user?.email ?? "",
    jwt: user?.jwt ?? ""
};
    
function deleteItem(menu_item: Menu_Item) {
    const update_query: MenuItemDelete = {
        where: {
            id: menu_item.id
        }
    };
    socket?.emit('menuItem:delete', auth, update_query);
}
```

## To listen to updates on the database and update locally

The server sends events like Menu_Item, Ingredient, which you 
need to listen for:

```ts
const socket = useSocket();
useEffect(() => {
    if (socket) {
        // Read in menuItems on page mount. "undefined" because we have no need for query during read all.
        socket.emit("menuItem:read", undefined, (new_menu_items: Menu_Item[]) => {
            setMenuItems(new_menu_items);
        });
        // Listen to changes and update
        socket.on("menuItem", (new_menu_items: Menu_Item[]) => {
            setMenuItems(new_menu_items);
        });
    }
}, [socket]);
```

## Example Code

app/menu integrates exsiting prisma code from the Server Sided Render, and uses that
to initially server the user, once loaded though it listens to changes from the database
and updates accordingly

## Clarifying stuff up

1. Why do we need to use useEffect?
    The client socket might not be available at all times,
    to insure no buggy reads, we wrap it in a useEffect.
2. Notice that the user session info is initialiy recovered
    from the server, this is cause next-auth does not pass
    any useful information to the client, so we need to get
    it ourselfves and pass it to the client. During the creation
    of the JWT (Java Web Token) another token is created and placed
    on in the database, this token is used to authorize users to do
    more restrictive CRUD operations.

## Refrence
Here are all the functions that the client can call to the server,
note that any time a modification is made, the server makes a brodcast
back to all clients that are listening to the corresponding table.
```ts
io.on("connect", (socket) => {
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
});
```