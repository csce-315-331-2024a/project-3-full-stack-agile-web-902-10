"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/lib/socket";

import { Menu_Item, Ingredient, Order_Log, Users} from "@prisma/client";


export default function TestPageClient({ user_info }: { user_info: Users }) {
    const [menu_items, setMenuItems] = useState<Menu_Item[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    // Create the socket and listen for changes
    const socket: any = useSocket();
    useEffect(() => {
        if (socket) {
            // Changes to a table are just the table name
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

    // For the user authentication, you need to get the session info from a server component
    // then you make an object with the email as the identifier and the jwt as the token
    // anything else you need for the CRUD operations you can add to data
    // The python side follows the same prisma schema so turn json to
    // a string and it
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

    const delete_menu_item = async (id: number) => {
        const packet = {
            email : user_info.email,
            jwt : user_info.jwt,
            data : {
                id: id,
            }
        }
        // Modifications to the table are table name_CRUD_OPERATION
        socket.emit("menuItem:delete", JSON.stringify(packet));
    }

    return (
        <div>
            <button onClick={() => create_new_menu_item("Test Item", 1099, "/", "Test Category")}>Create New Menu Item</button>
            <h1>Test Page</h1>
            <p>Socket: {socket ? "Connected" : "Not Connected"}</p>
            <h2>Menu Items</h2>
            <ul>
                {menu_items.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
            <h2>Ingredients</h2>
            <ul>
                {ingredients.map((ingredient) => (
                    <li key={ingredient.id}>{ingredient.name}</li>
                ))}
            </ul>
        </div>
    )
}