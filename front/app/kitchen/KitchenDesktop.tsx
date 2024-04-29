"use client";

import { Order_Log, Order_Status, Menu_Item, Ingredient, Ingredients_Menu, Users, Kitchen, Roles } from "@prisma/client";
import { useState, useEffect } from "react";
import { useSocket, OrderLogRead, OrderLogCreate } from "@/lib/socket";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";
import KitchenEditButton from "./KitchenEditButton";


export default function KitchenDesktop({ user }: { user: Users }) {
    const [orders, setOrders] = useState<Order_Log[]>([]);
    const [menu_items, setMenuItems] = useState<Menu_Item[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [ingredients_menu, setIngredientsMenu] = useState<Ingredients_Menu[]>([]);
    const [kitchen, setKitchen] = useState<Kitchen[]>([]);

    const socket = useSocket();
    const orderLogRead: OrderLogRead = {
        where: {
            status: {
                not: Order_Status.Completed,
            }
        }
    };

    useEffect(() => {
        if (socket) {
            socket.emit("orderLog:read", orderLogRead, (new_orders: Order_Log[]) => {
                new_orders.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
                setOrders(new_orders);
            });
            socket.on("orderLog", (new_orders: Order_Log[]) => {
                new_orders.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
                setOrders(new_orders);

            });
            socket.emit("menuItem:read", {}, (new_menu_items: Menu_Item[]) => {
                setMenuItems(new_menu_items);
            });
            socket.on("menuItem", (new_menu_items: Menu_Item[]) => {
                setMenuItems(new_menu_items);
            });
            socket.emit("ingredient:read", {}, (new_ingredients: Ingredient[]) => {
                setIngredients(new_ingredients);
            });
            socket.on("ingredient", (new_ingredients: Ingredient[]) => {
                setIngredients(new_ingredients);
            });
            socket.emit("ingredientMenu:read", {}, (new_ingredients_menu: Ingredients_Menu[]) => {
                setIngredientsMenu(new_ingredients_menu);
            });
            socket.on("ingredientMenu", (new_ingredients_menu: Ingredients_Menu[]) => {
                setIngredientsMenu(new_ingredients_menu);
            });
            socket.emit("kitchen:read", {}, (new_kitchen: Kitchen[]) => {
                setKitchen(new_kitchen);
            });
            socket.on("kitchen", (new_kitchen: Kitchen[]) => {
                setKitchen(new_kitchen);
            });
        }
    }, [socket]);

    function getOrderIDs(kitchen: Kitchen[]) {
        // return an array of unqiue order IDs
        return Array.from(new Set(kitchen.map(kitchen => kitchen.order_id)));
    }

    function getIngredientNames(kitchenIngredients: string) {
        const ingredientIds = kitchenIngredients.split(","); 
        return ingredientIds.map(id => {
            const ingredient = ingredients.find(ingredient => ingredient.id === Number(id));
            return ingredient ? ingredient.name : id.toString();
        }).join(", ");
    }

    function aggregateItems(itemIds: number[]) {
        return itemIds.reduce((acc: { [key: number]: number }, id) => {
            acc[id] = (acc[id] || 0) + 1;
            return acc;
        }, {});
    }

    function renderMenuItemQuantities(menuIds: number[]) {
        const counts = aggregateItems(menuIds);
        return Object.entries(counts).map(([id, count]) => {
            const item = menu_items.find(item => item.id === Number(id));
            return <div key={id}>{item ? `${item.name} x${count}` : `ID ${id} x${count}`}</div>;
        });
    }

    function renderIngredientQuantities(menuIds: number[]) {
        const ingredientCounts = menuIds.flatMap(menu_id => {
            return ingredients_menu.filter(ingredient_menu => ingredient_menu.menu_id === Number(menu_id))
                .map(ingredient_menu => ingredient_menu.ingredients_id);
        });
        const counts = aggregateItems(ingredientCounts);
        return Object.entries(counts).map(([id, count]) => {
            const ingredient = ingredients.find(ingredient => ingredient.id === Number(id));
            return <div key={id}>{ingredient ? `${ingredient.name} x${count}` : `ID ${id} x${count}`}</div>;
        });
    }

    const auth = {
        email: user.email,
        jwt: user.jwt,
    }

    function combineIngredients(orders: Kitchen[]) {
        let combinedArray: string[] = [];
        orders.forEach(function (order) {
            // Split each ingredients_ids string by ',' and filter out empty elements
            let ingredients = order.ingredients_ids.split(',').filter(n => n !== '');
            // Concatenate the cleaned ingredients list to the combined array
            combinedArray = combinedArray.concat(ingredients);
        });
        // Join all elements with ', ' to create the final string
        return combinedArray.join(', ');
    }

    function finishKitchenOrder(kitchenOrder: Kitchen[]) {
        socket.emit("kitchen:delete", auth, { where: { order_id: kitchenOrder[0].order_id } });
        // find the total price of the cart by taking the kitchenOrder and getting the menu_item fron the id, and reducing their prices
        const totalPrice = kitchenOrder.reduce((acc, kitchen) => {
            const menuItem = menu_items.find(item => item.id === kitchen.menu_id) as Menu_Item;
            return acc + menuItem.price;
        }, 0);

        const menuItemIdString = kitchenOrder.map(kitchen => kitchen.menu_id).join(", ");

        // make the string for the ingredients, and a space between each comma
        const ingredientsString = combineIngredients(kitchenOrder);

        const create_query: OrderLogCreate = {
            data: {
                price: totalPrice,
                menu_items: menuItemIdString,
                ingredients: ingredientsString,

            }
        }
        socket.emit("orderLog:create", auth, create_query);
    }

    // show orders in a table
    return (
        <div className="pt-4 grid grid-cols-3 gap-4 transition-all w-full overflow-x-auto px-8 rounded-sm">
            {getOrderIDs(kitchen).map(orderId => {
                const kitchenOrder = kitchen.filter(kitchen => kitchen.order_id === orderId);
                return (
                    <Card key={orderId} className="w-auto h-auto">
                        <CardHeader>
                            <CardTitle>#{kitchenOrder[0].order_id}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                {kitchenOrder.map((kitchen) => {
                                    const menuItem = menu_items.find(item => item.id === kitchen.menu_id);
                                    return (
                                        <div key={kitchen.id}>
                                            <p className="pt-2">Menu Item: {menuItem ? menuItem.name : `ID ${kitchen.menu_id}`}</p>
                                            <p className="pb-2">Ingredients: {getIngredientNames(kitchen.ingredients_ids)}</p>
                                            {(user.role === Roles.Cashier || user.role === Roles.Manager || user.role === Roles.Admin) &&
                                                <KitchenEditButton user={user} menu_item={menuItem as Menu_Item} ingredients_menu={ingredients_menu} ingredients={ingredients} currentIDS={ kitchen.ingredients_ids.split(",").map(Number)} kitchenID  ={kitchen.id}/>
                                            }
                                        </div>
                                    );
                                })}
                            </CardDescription>
                        </CardContent>
                        <CardFooter className="flex flex-row gap-x-4">
                            {(user.role === Roles.Kitchen || user.role === Roles.Manager || user.role === Roles.Admin) &&
                                <Button variant="destructive" onClick={() => { finishKitchenOrder(kitchenOrder) }}>Complete Order</Button>
                            }
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
};