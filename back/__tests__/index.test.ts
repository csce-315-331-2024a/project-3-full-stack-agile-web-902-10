import io, { Socket } from 'socket.io-client'
import {
    setupTestListen,
    IngredientCreate,
    IngredientRead,
    IngredientUpdate,
    IngredientDelete,
    IngredientsMenuCreate,
    IngredientsMenuRead,
    IngredientsMenuUpdate,
    IngredientsMenuDelete,
    LoginLogCreate,
    LoginLogRead,
    LoginLogUpdate,
    LoginLogDelete,
    MenuItemCreate,
    MenuItemRead,
    MenuItemUpdate,
    MenuItemDelete,
    OrderLogCreate,
    OrderLogRead,
    OrderLogUpdate,
    OrderLogDelete,
    UsersCreate,
    UsersRead,
    UsersUpdate,
    UsersDelete,
} from "../src/routes";
import prisma from '../src/client';
import { Ingredient, Ingredients_Menu, Login_Log, Menu_Item, Order_Log, Users } from '@prisma/client';

const auth = {
    email: "test@utsawb.dev",
    jwt: 1,
}

let socket: Socket;
beforeEach(async () => {
    socket = io('localhost:5000');
});

afterEach(async () => {
    socket.close();
});

test("ingredientCreate", async () => {
    const ingredient: IngredientCreate = {
        data: {
            name: "test",
            stock: 1,
            category: "test",
            min_stock: 1,
            is_active: false,
        }
    }
    socket.on("ingredient", (data: Ingredient[]) => {
        expect(data).toEqual(prisma.ingredient.findMany());
    });
    socket.emit("ingredientCreate", ingredient, auth);
});

test("ingredientRead", async () => {
    socket.emit("ingredientRead", {}, (data: Ingredient[]) =>
        expect(data).toEqual(prisma.ingredient.findMany()),
    );
});

test("ingredientUpdate", async () => {
    const ingredient: IngredientUpdate = {
        where: { name: "test" },
        data: {
            stock: 2,
            category: "test",
            min_stock: 2,
            is_active: false,
        }
    }
    socket.on("ingredient", (data: Ingredient[]) => {
        expect(data).toEqual(prisma.ingredient.findMany());
    });
    socket.emit("ingredientUpdate", ingredient, auth);
});

test("ingredientDelete", async () => {
    const ingredient: IngredientDelete = {
        where: { name: "test" }
    }
    socket.on("ingredient", (data: Ingredient[]) => {
        expect(data).toEqual(prisma.ingredient.findMany());
    });
    socket.emit("ingredientDelete", ingredient, auth);
});

test("ingredientsMenuCreate", async () => {
    const ingredientsMenu: IngredientsMenuCreate = {
        data: {
            menu_id: 1,
            ingredients_id: 1,
            quantity: 1,
        }
    }
    socket.on("ingredientsMenu", (data: Ingredients_Menu[]) => {
        expect(data).toEqual(prisma.ingredients_Menu.findMany());
    });
    socket.emit("ingredientsMenuCreate", ingredientsMenu, auth);
});

test("ingredientsMenuRead", async () => {
    socket.emit("ingredientsMenuRead", {}, (data: Ingredients_Menu[]) =>
        expect(data).toEqual(prisma.ingredients_Menu.findMany()),
    );
});

test("ingredientsMenuUpdate", async () => {
    const ingredientsMenu: IngredientsMenuUpdate = {
        where: { id: 1 },
        data: {
            quantity: 2,
        }
    }
    socket.on("ingredientsMenu", (data: Ingredients_Menu[]) => {
        expect(data).toEqual(prisma.ingredients_Menu.findMany());
    });
    socket.emit("ingredientsMenuUpdate", ingredientsMenu, auth);
});

test("ingredientsMenuDelete", async () => {
    const ingredientsMenu: IngredientsMenuDelete = {
        where: { id: 1 }
    }
    socket.on("ingredientsMenu", (data: Ingredients_Menu[]) => {
        expect(data).toEqual(prisma.ingredients_Menu.findMany());
    });
    socket.emit("ingredientsMenuDelete", ingredientsMenu, auth);
});

test("loginLogCreate", async () => {
    const loginLog: LoginLogCreate = {
        data: {
            user_id: 1,
            time: new Date(),
            login: true,
        }
    }
    socket.on("loginLog", (data: Login_Log[]) => {
        expect(data).toEqual(prisma.login_Log.findMany());
    });
    socket.emit("loginLogCreate", loginLog, auth);
});

test("loginLogRead", async () => {
    socket.emit("loginLogRead", {}, (data: Login_Log[]) =>
        expect(data).toEqual(prisma.login_Log.findMany()),
    );
});

test("loginLogUpdate", async () => {
    const loginLog: LoginLogUpdate = {
        where: { id: 1 },
        data: {
            login: false,
        }
    }
    socket.on("loginLog", (data: Login_Log[]) => {
        expect(data).toEqual(prisma.login_Log.findMany());
    });
    socket.emit("loginLogUpdate", loginLog, auth);
});

test("loginLogDelete", async () => {
    const loginLog: LoginLogDelete = {
        where: { id: 1 }
    }
    socket.on("loginLog", (data: Login_Log[]) => {
        expect(data).toEqual(prisma.login_Log.findMany());
    });
    socket.emit("loginLogDelete", loginLog, auth);
});

test("menuItemCreate", async () => {
    const menuItem: MenuItemCreate = {
        data: {
            name: "test",
            price: 1,
            image_url: "/test",
            category: "test",
            is_active: false,
        }
    }
    socket.on("menuItem", (data: Menu_Item[]) => {
        expect(data).toEqual(prisma.menu_Item.findMany());
    });
    socket.emit("menuItemCreate", menuItem, auth);
});

test("menuItemRead", async () => {
    socket.emit("menuItemRead", {}, (data: Menu_Item[]) =>
        expect(data).toEqual(prisma.menu_Item.findMany()),
    );
});

test("menuItemUpdate", async () => {
    const menuItem: MenuItemUpdate = {
        where: { name: "test" },
        data: {
            price: 2,
            image_url: "/test",
            category: "test",
            is_active: false,
        }
    }
    socket.on("menuItem", (data: Menu_Item[]) => {
        expect(data).toEqual(prisma.menu_Item.findMany());
    });
    socket.emit("menuItemUpdate", menuItem, auth);
});

test("menuItemDelete", async () => {
    const menuItem: MenuItemDelete = {
        where: { name: "test" }
    }
    socket.on("menuItem", (data: Menu_Item[]) => {
        expect(data).toEqual(prisma.menu_Item.findMany());
    });
    socket.emit("menuItemDelete", menuItem, auth);
});

test("orderLogCreate", async () => {
    const orderLog: OrderLogCreate = {
        data: {
            time: new Date(),
            price: 1,
            menu_items: "1, 2, 3",
            ingredients: "1, 2, 3",
            status: "Completed"
        }
    }
    socket.on("orderLog", (data: Order_Log[]) => {
        expect(data).toEqual(prisma.order_Log.findMany());
    });
    socket.emit("orderLogCreate", orderLog, auth);
});

test("orderLogRead", async () => {
    socket.emit("orderLogRead", {}, (data: Order_Log[]) =>
        expect(data).toEqual(prisma.order_Log.findMany()),
    );
});

test("orderLogUpdate", async () => {
    const orderLog: OrderLogUpdate = {
        where: { id: 1 },
        data: {
            status: "Completed",
        }
    }
    socket.on("orderLog", (data: Order_Log[]) => {
        expect(data).toEqual(prisma.order_Log.findMany());
    });
    socket.emit("orderLogUpdate", orderLog, auth);
});

test("orderLogDelete", async () => {
    const orderLog: OrderLogDelete = {
        where: { id: 1 }
    }
    socket.on("orderLog", (data: Order_Log[]) => {
        expect(data).toEqual(prisma.order_Log.findMany());
    });
    socket.emit("orderLogDelete", orderLog, auth);
});

test("usersCreate", async () => {
    const users: UsersCreate = {
        data: {
            email: "test@revs.com",
            name: "test",
            avatar: null,
            is_manager : false,
            is_employee: false,
            jwt: "1",
            role: "Customer",
        }
    };
    socket.on("users", (data: Users[]) => {
        expect(data).toEqual(prisma.users.findMany());
    });
    socket.emit("usersCreate", users, auth);
});

test("usersRead", async () => {
    socket.emit("usersRead", {}, (data: Users[]) =>
        expect(data).toEqual(prisma.users.findMany()),
    );
});

test("usersUpdate", async () => {
    const users: UsersUpdate = {
        where: { email: "test@revs.com" },
        data: {
            name: "test",
            avatar: null,
            is_manager : false,
            is_employee: false,
            jwt: "1",
            role: "Customer",
        }
    }
    socket.on("users", (data: Users[]) => {
        expect(data).toEqual(prisma.users.findMany());
    });
    socket.emit("usersUpdate", users, auth);
});

test("usersDelete", async () => {
    const users: UsersDelete = {
        where: { email: "test@revs.com" }
    }
    socket.on("users", (data: Users[]) => {
        expect(data).toEqual(prisma.users.findMany());
    });
    socket.emit("usersDelete", users, auth);
});