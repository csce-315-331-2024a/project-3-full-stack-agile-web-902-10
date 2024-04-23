"use client";

import { Order_Log, Order_Status, Menu_Item, Ingredient, Ingredients_Menu, Users } from "@prisma/client";
import { useState, useEffect } from "react";
import { useSocket, OrderLogRead } from "@/lib/socket";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


export default function KitchenDesktop({ orders_init, menu_items_init, ingredients_init, ingredients_menu_init, user }: { orders_init: Order_Log[], menu_items_init: Menu_Item[], ingredients_init: Ingredient[], ingredients_menu_init: Ingredients_Menu[], user: Users }) {
    const [orders, setOrders] = useState<Order_Log[]>(orders_init);
    const [menu_items, setMenuItems] = useState<Menu_Item[]>(menu_items_init);
    const [ingredients, setIngredients] = useState<Ingredient[]>(ingredients_init);
    const [ingredients_menu, setIngredientsMenu] = useState<Ingredients_Menu[]>(ingredients_menu_init);

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
                setOrders(new_orders);
            });
            socket.on("orderLog", (new_orders: Order_Log[]) => {
                setOrders(new_orders);
            });
            socket.emit("menu_Item:read", {}, (new_menu_items: Menu_Item[]) => {
                setMenuItems(new_menu_items);
            });
            socket.on("menu_Item", (new_menu_items: Menu_Item[]) => {
                setMenuItems(new_menu_items);
            });
            socket.emit("ingredient:read", {}, (new_ingredients: Ingredient[]) => {
                setIngredients(new_ingredients);
            });
            socket.on("ingredient", (new_ingredients: Ingredient[]) => {
                setIngredients(new_ingredients);
            });
            socket.emit("ingredients_Menu:read", {}, (new_ingredients_menu: Ingredients_Menu[]) => {
                setIngredientsMenu(new_ingredients_menu);
            });
            socket.on("ingredients_Menu", (new_ingredients_menu: Ingredients_Menu[]) => {
                setIngredientsMenu(new_ingredients_menu);
            });
        }
    }, [socket]);

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

    function changeOrderStatus(order: Order_Log) {
        const newStatus = order.status === Order_Status.Created ? Order_Status.Cooking : Order_Status.Completed;
        socket?.emit("orderLog:update", { email : user.email, jwt: user.jwt }, { where: { id: order.id }, data: { status: newStatus } });
    }

    // show orders in a table
    return (
        <div className="w-full overflow-x-auto px-8 rounded-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Menu Items</TableHead>
                        <TableHead>Ingredients</TableHead>
                        <TableHead>Order Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id} onClick={() => { }}>
                            <TableCell>
                                <p className="font-bold text-2xl">
                                    #{order.id}
                                </p>
                            </TableCell>
                            <TableCell className="font-bold text-xl">{new Date(order.time).toLocaleString()}</TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1 font-bold text-xl">
                                    {renderMenuItemQuantities(order.menu_items.split(", ").map(Number))}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1 font-bold text-md">
                                    {renderIngredientQuantities(order.menu_items.split(", ").map(Number))}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant={order.status == "Created" ? "destructive" : "default"} className="w-[10vw] h-[8vh] font-bold text-4xl">{order.status}</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Change order state?
                                            </DialogTitle>
                                            <DialogDescription>
                                                {order.status == "Created" ? "Change the order status to 'Cooking'?" : "Change the order status to 'Completed'?"}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Button variant="default" onClick={() => changeOrderStatus(order)}>
                                            {order.status == "Created" ? "Start Cooking" : "Complete Order"}
                                        </Button>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
