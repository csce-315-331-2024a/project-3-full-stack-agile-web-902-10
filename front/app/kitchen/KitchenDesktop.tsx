"use client";

import { Menu_Item, Ingredient, Ingredients_Menu, Users, Kitchen, Roles } from "@prisma/client";
import { useState, useEffect } from "react";
import { useSocket, OrderLogCreate, IngredientUpdate } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import KitchenEditButton from "./KitchenEditButton";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function KitchenDesktop({ user, menu_items_init, ingredients_init, ingredients_menu_init, kitchen_init }: { user: Users, menu_items_init: Menu_Item[], ingredients_init: Ingredient[], ingredients_menu_init: Ingredients_Menu[], kitchen_init: Kitchen[] }) {
    const [menu_items, setMenuItems] = useState<Menu_Item[]>(menu_items_init);
    const [ingredients, setIngredients] = useState<Ingredient[]>(ingredients_init);
    const [ingredients_menu, setIngredientsMenu] = useState<Ingredients_Menu[]>(ingredients_menu_init);
    const [kitchen, setKitchen] = useState<Kitchen[]>(kitchen_init);

    const socket = useSocket();
    const router = useRouter();
    useEffect(() => {
        if (socket) {
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
            socket.on("users", (new_users: Users[]) => {
                const updated_user = new_users.find((u) => u.id === user?.id);
                if (updated_user === undefined || (updated_user.role !== Roles.Kitchen && updated_user.role !== Roles.Cashier && updated_user.role !== Roles.Manager && updated_user.role !== Roles.Admin)) {
                    router.push("/menu");
                }
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
        orders.forEach(function(order) {
            // Split each ingredients_ids string by ',' and filter out empty elements
            let ingredients = order.ingredients_ids.split(',').filter(n => n !== '');
            // Concatenate the cleaned ingredients list to the combined array
            combinedArray = combinedArray.concat(ingredients);
        });
        // Join all elements with ', ' to create the final string
        return combinedArray.join(', ');
    }

    function refundOrder(kitchenOrder: Kitchen[]) {
        socket.emit("kitchen:delete", auth, { where: { order_id: kitchenOrder[0].order_id } });
    }

    function finishKitchenOrder(kitchenOrder: Kitchen[]) {
        socket.emit("kitchen:delete", auth, { where: { order_id: kitchenOrder[0].order_id } });
        // find the total price of the cart by taking the kitchenOrder and getting the menu_item fron the id, and reducing their prices
        const totalPrice = kitchenOrder.reduce((acc, kitchen) => {
            const menuItem = menu_items.find(item => item.id === kitchen.menu_id) as Menu_Item;
            return acc + menuItem.price;
        }, 0);

        for (let i = 0; i < kitchenOrder.length; ++i) {
            const k = kitchenOrder[i];
            const ing = k.ingredients_ids.split(",").map(Number);
            for (let j = 0; j < ing.length; ++j) {
                const ratio = ingredients_menu.find(im => im.menu_id === k.menu_id && im.ingredients_id === ing[j])?.quantity;
                const update_query: IngredientUpdate = {
                    where: {
                        id: ing[j]
                    },
                    data: {
                        stock : {
                            decrement: ratio
                        }
                    }
                };
                socket.emit("ingredient:update", auth, update_query);
            }
        }

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
        if (kitchen[0].email !== null) {
            fetch("/api/send/", { method: "POST", body: JSON.stringify(kitchen) });
        }
    }

    // show orders in a table
    return (
        <div className="pt-4 grid grid-cols-3 gap-4 transition-all w-full overflow-x-auto px-8 rounded-sm">
            {getOrderIDs(kitchen).map(orderId => {
                const kitchenOrder = kitchen.filter(kitchen => kitchen.order_id === orderId);
                return (
                    <Card key={orderId} className="w-auto h-auto ">
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
                                                <KitchenEditButton user={user} menu_item={menuItem as Menu_Item} ingredients_menu={ingredients_menu} ingredients={ingredients} currentIDS={kitchen.ingredients_ids.split(",").map(Number)} kitchenID={kitchen.id} />
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
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <Button variant="default">Refund Order</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Proceed with Refund?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Amount to Refund;
                                            {" " + kitchenOrder.reduce((acc, kitchen) => {
                                                const menuItem = menu_items.find(item => item.id === kitchen.menu_id) as Menu_Item;
                                                return acc + menuItem.price;
                                            }, 0)}$.
                                            Choose the method of refund below.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogCancel className="bg-red-500 text-white" onClick={() => refundOrder(kitchenOrder)}>
                                            Refund With Card
                                        </AlertDialogCancel>
                                        <AlertDialogCancel className="bg-red-500 text-white" onClick={() => refundOrder(kitchenOrder)}>
                                            Refund With Cash
                                        </AlertDialogCancel>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
};
