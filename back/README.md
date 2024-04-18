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
const create_new_menu_item = async (name: string, price: number, image_url: string, category: string) => {
    const packet = {
        email : user_info.email,
        jwt : user_info.jwt,
        data : {
            name: name,
            price: price,
            image_url: image_url,
            category: category,
        }
    }
    // Modifications to the table are table name_CRUD_OPERATION
    socket.emit("menuItem:create", JSON.stringify(packet));
}
```

## To listen to updates on the database and update locally
The server sends events like Menu_Item, Ingredient, which you 
need to listen for:

```ts
useEffect(() => {
    if (socket) {
        // Changes to a table are just the table_name
        socket.on("menuItem", (menu_items_changed: string) => {
            const parsed: Menu_Item[] = JSON.parse(menu_items_changed);
            setMenuItems(parsed);
        });
        socket.on("ingredient", (ingredients_changed: string) => {
            const parsed: Ingredient[] = JSON.parse(ingredients_changed);
            setIngredients(parsed);
        });
    }
}, [socket]);
```

## Example Code
1. app/testpage has a simple example of using this api
2. app/menu integrates exsiting prisma code from the Server Sided Render, and uses that
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