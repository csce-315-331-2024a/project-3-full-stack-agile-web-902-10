# How to use this server

## Preface

Instead of using the traditional REST api of even something like tRPC, 
the fastest and easiest method was WebSockets. We were already looking
into them for having client's be updated when the databse was modified.
However it turned out to be a very pleasant experience for even simple
data fetching.

## Server setup

Right now the server is not hosted, and needs to be run locally for
debugging purposes, run it in a seperate terminal after installing the
python dependencies using pip.


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
});
```