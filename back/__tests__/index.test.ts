import * as routes from "../src/routes";
import { prismaMock } from "../src/singleton";
import { ioMock } from "../src/socketmock";

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

const mock_users: Users[] = [
    {
        id: 0,
        name: "authed",
        email: "authed@utsawb.dev",
        avatar: null,
        is_employee: true,
        is_manager: true,
        jwt: "1",
        role: Roles.Admin,
    },
    {
        id: 1,
        name: "non authed",
        email: "nonauthed@utsawb.dev",
        avatar: null,
        is_employee: false,
        is_manager: false,
        jwt: "2",
        role: Roles.Customer,
    },
];

const mock_auth: routes.AuthPacket = {
    email: mock_users[0].email,
    jwt: mock_users[0].jwt,
}

const mock_ingredients: Ingredient[] = [
    {
        id: 0,
        name: "Flour",
        stock: 120,
        category: "Baking",
        min_stock: 50,
        is_active: true
    },
    {
        id: 1,
        name: "Sugar",
        stock: 80,
        category: "Baking",
        min_stock: 30,
        is_active: true
    },
    {
        id: 2,
        name: "Olive Oil",
        stock: 60,
        category: "Oil",
        min_stock: 20,
        is_active: true
    },
    {
        id: 3,
        name: "Basil",
        stock: 30,
        category: "Herbs",
        min_stock: 10,
        is_active: false
    },
    {
        id: 4,
        name: "Tomatoes",
        stock: 0,
        category: "Vegetables",
        min_stock: 20,
        is_active: true
    }
];

const mock_login_logs: Login_Log[] = [
    {
        id: 0,
        time: new Date('2024-04-23T08:00:00Z'),
        login: true,
        user_id: 101
    },
    {
        id: 1,
        time: new Date('2024-04-23T12:00:00Z'),
        login: false,
        user_id: 101
    },
    {
        id: 2,
        time: new Date('2024-04-23T09:15:00Z'),
        login: true,
        user_id: 102
    },
    {
        id: 3,
        time: new Date('2024-04-23T17:30:00Z'),
        login: false,
        user_id: 102
    },
    {
        id: 4,
        time: new Date('2024-04-23T10:00:00Z'),
        login: true,
        user_id: 103
    },
    {
        id: 5,
        time: new Date('2024-04-23T15:00:00Z'),
        login: false,
        user_id: 103
    }
];

const mock_menu_items: Menu_Item[] = [
    {
        id: 1,
        name: "Classic Burger",
        price: 8.99,
        image_url: "https://example.com/images/classic-burger.jpg",
        category: "Main Course",
        is_active: true
    },
    {
        id: 2,
        name: "Vegan Salad",
        price: 7.50,
        image_url: "https://example.com/images/vegan-salad.jpg",
        category: "Salads",
        is_active: true
    },
    {
        id: 3,
        name: "Chocolate Cake",
        price: 4.25,
        image_url: "https://example.com/images/chocolate-cake.jpg",
        category: "Desserts",
        is_active: true
    },
    {
        id: 4,
        name: "Cappuccino",
        price: 3.00,
        image_url: "https://example.com/images/cappuccino.jpg",
        category: "Beverages",
        is_active: true
    },
    {
        id: 5,
        name: "Cheese Pizza",
        price: 9.99,
        image_url: "https://example.com/images/cheese-pizza.jpg",
        category: "Main Course",
        is_active: false
    }
];

const mock_order_logs: Order_Log[] = [
    {
        id: 1,
        time: new Date('2024-04-23T12:30:00Z'),
        price: 24.95,
        menu_items: JSON.stringify([1, 3]), // IDs of menu items
        ingredients: JSON.stringify([2, 4, 6]), // IDs of ingredients used
        status: Order_Status.Completed
    },
    {
        id: 2,
        time: new Date('2024-04-23T13:00:00Z'),
        price: 15.50,
        menu_items: JSON.stringify([2]), // IDs of menu items
        ingredients: JSON.stringify([1, 5]), // IDs of ingredients used
        status: Order_Status.Created
    },
    {
        id: 3,
        time: new Date('2024-04-23T13:15:00Z'),
        price: 8.75,
        menu_items: JSON.stringify([4]), // IDs of menu items
        ingredients: JSON.stringify([3]), // IDs of ingredients used
        status: Order_Status.Cooking
    }
];

test("verifyTokenHappy", async () => {
    prismaMock.users.findUnique.mockResolvedValue(mock_users[0]);
    await expect(routes.verifyToken(mock_users[0].email, mock_users[0].jwt)).resolves.toEqual(true);
});

test("verifyTokenUnhappy", async () => {
    prismaMock.users.findUnique.mockResolvedValue(mock_users[1]);
    await expect(routes.verifyToken(mock_users[1].email, mock_users[1].jwt)).resolves.toEqual(false);
});

test("ingredientCreate", async () => {
    prismaMock.ingredient.create.mockResolvedValue(mock_ingredients[0]);
    prismaMock.ingredient.findMany.mockResolvedValue(mock_ingredients);

    jest.mock('../src/index', () => ({
        verifyToken: jest.fn().mockReturnValue(true)
    }));

    await routes.ingredientCreate(mock_auth, { data: mock_ingredients[0] });
    // expect(ioMock.emit).toHaveBeenCalledWith("ingredient", mock_ingredients);
    expect(ioMock.emit).toHaveBeenCalled();
});