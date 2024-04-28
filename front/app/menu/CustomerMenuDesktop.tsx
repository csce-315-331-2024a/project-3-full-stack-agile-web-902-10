"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/provider/cart-store-provider"
import { Menu_Item, Users, Ingredient, Ingredients_Menu } from "@prisma/client"
import { useSocket } from "@/lib/socket";
import { useLanguageStore } from "@/lib/provider/language-store-provider";
import CustomerMenuItem from "@/app/menu/CustomerMenuItem";

const static_text = {
    category: "Category",
    add_to_cart: "Add to Cart",
}

export default function CustomerMenuDesktop({ menu_items_init, ingredients_init, ingredient_menus_init, user }: { menu_items_init: Menu_Item[], ingredients_init: Ingredient[], ingredient_menus_init: Ingredients_Menu[], user: Users | null}) {
    // make a state for the selected category
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [menu_items, setMenuItems] = useState<Menu_Item[]>(menu_items_init);
    const [ingredients, setIngredients] = useState<Ingredient[]>(ingredients_init);
    const [ingredient_menus, setIngredientMenus] = useState<Ingredients_Menu[]>(ingredient_menus_init);
    const [categories, setCategories] = useState<string[]>(Array.from(new Set(menu_items_init.map((item) => item.category))));

    const onCategoryClick = (category: string) => {
        if (selectedCategory === category) {
            setSelectedCategory(undefined);
        } else {
            setSelectedCategory(category);
        }
    }

    // All data that needs to be processed by the server should be sent through the socket
    const language = useLanguageStore((state) => state.language);
    const [current_language, setCurrentLanguage] = useState(language);
    let [translated, setTranslated] = useState(static_text);

    // Deal with realtime update + translation
    // the translating makes this code realllllly long
    const socket = useSocket();
    useEffect(() => {
        if (socket) {
            socket.emit("ingredientMenu:read", undefined, (new_ingredient_menus: Ingredients_Menu[]) => {
                setIngredientMenus(new_ingredient_menus);
            });
            socket.on("ingredientMenu", (new_ingredient_menus: Ingredients_Menu[]) => {
                setIngredientMenus(new_ingredient_menus);
            });

            socket.emit("menuItem:read", {where: {is_active : true}}, (new_menu_items: Menu_Item[]) => {
                new_menu_items = new_menu_items.filter((item) => item.is_active && (item.date === null || new Date(item.date).getTime() >= new Date().getTime()));
                if (language !== "English") {
                    socket.emit("translateArray", new_menu_items.map((item) => item.name), language, (translated_names: string[]) => {
                        new_menu_items.forEach((item, index) => {
                            item.name = translated_names[index];
                        });
                        socket.emit("translateArray", new_menu_items.map((item) => item.category), language, (translated_categories: string[]) => {
                            new_menu_items.forEach((item, index) => {
                                item.category = translated_categories[index];
                            });
                            setMenuItems(new_menu_items);
                            setCategories(Array.from(new Set(new_menu_items.map((item) => item.category))));
                            setCurrentLanguage(language);
                        });
                    });
                }
                else {
                    setMenuItems(new_menu_items);
                    setCategories(Array.from(new Set(new_menu_items.map((item) => item.category))));
                }
            });
            socket.on("menuItem", (new_menu_items: Menu_Item[]) => {
                // filter out non-active items
                new_menu_items = new_menu_items.filter((item) => item.is_active && (item.date === null || new Date(item.date).getTime() >= new Date().getTime()));
                if (language !== "English") {
                    socket.emit("translateArray", new_menu_items.map((item) => item.name), language, (translated_names: string[]) => {
                        new_menu_items.forEach((item, index) => {
                            item.name = translated_names[index];
                        });
                        socket.emit("translateArray", new_menu_items.map((item) => item.category), language, (translated_categories: string[]) => {
                            new_menu_items.forEach((item, index) => {
                                item.category = translated_categories[index];
                            });
                            setMenuItems(new_menu_items);
                            setCategories(Array.from(new Set(new_menu_items.map((item) => item.category))));
                        });
                    });
                }
                else {
                    setMenuItems(new_menu_items);
                    setCategories(Array.from(new Set(new_menu_items.map((item) => item.category))));
                }
            });
            socket.emit("ingredient:read", undefined, (new_ingredients: Ingredient[]) => {
                if (language !== "English") {
                    socket.emit("translateArray", new_ingredients.map((item) => item.name), language, (translated_names: string[]) => {
                        new_ingredients.forEach((item, index) => {
                            item.name = translated_names[index];
                        });
                        setIngredients(new_ingredients);
                    });
                }
                else {
                    setIngredients(new_ingredients);
                }
            });
            socket.on("ingredient", (new_ingredients: Ingredient[]) => {
                if (language !== "English") {
                    socket.emit("translateArray", new_ingredients.map((item) => item.name), language, (translated_names: string[]) => {
                        new_ingredients.forEach((item, index) => {
                            item.name = translated_names[index];
                        });
                        setIngredients(new_ingredients);
                    });
                }
                else {
                    setIngredients(new_ingredients);
                }
            });
            if (language !== "English") {
                socket.emit("translateJSON", translated, language, (new_translated: typeof translated) => {
                    setTranslated(new_translated);
                });
            }
            else {
                setTranslated(static_text);
            }
        }
    }, [socket, language]);

    return (
        <div className="flex flex-row">
            <ScrollArea className="h-[92vh] w-auto p-10 whitespace-nowrap">
                <div className="flex flex-col w-[10vw] space-y-8 justify-center items-center transition-all">
                    <h1 className="text-xl font-bold"> {translated.category} </h1>
                    <Separator />
                    {categories.map((cat) => (
                        <Button key={cat} variant={selectedCategory === cat ? "default" : "secondary"} className="w-[8vw] h-[9vh] text-xl font-bold whitespace-normal" onClick={() => onCategoryClick(cat)}> {cat} </Button>
                    ))}
                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>
            <ScrollArea className="h-[92vh] w-[90vw] p-8 whitespace-nowrap">
                <div className="grid grid-cols-3 gap-4 transition-all">
                    {menu_items.filter((menu_item) => selectedCategory === undefined || menu_item.category === selectedCategory).map((menu_item) => (
                        <CustomerMenuItem key={menu_item.name} menu_item={menu_item} ingredients={ingredients} ingredient_menus={ingredient_menus} translated={translated} />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
