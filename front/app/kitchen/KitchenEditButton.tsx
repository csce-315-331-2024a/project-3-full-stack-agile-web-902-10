import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu_Item, Ingredient, Ingredients_Menu, Users, Kitchen, Roles } from "@prisma/client";
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
import { useSocket, KitchenUpdate, AuthPacket } from "@/lib/socket";

export default function EditButton({ user, menu_item, ingredients_menu, ingredients, currentIDS, kitchenID }: { user: Users, menu_item: Menu_Item, ingredients_menu: Ingredients_Menu[], ingredients: Ingredient[], currentIDS: number[], kitchenID: number }) {

    const ingredients_in_menu_item = ingredients_menu.filter((ingredient_menu) => ingredient_menu.menu_id === menu_item.id);
    const [selectedIngredients, setSelectedIngredients] = useState<number[]>(currentIDS);

    const on_ingredient_click = (ingredient_id: number) => {
        if (selectedIngredients.includes(ingredient_id)) {
            setSelectedIngredients(selectedIngredients.filter((selectedIngredient) => selectedIngredient !== ingredient_id));
        } else {
            setSelectedIngredients([...selectedIngredients, ingredient_id]);
        }
    }

    const auth: AuthPacket = {
        email: user.email,
        jwt: user.jwt,
    }

    const socket = useSocket();
    function submitChanges() {
        const ingredientString = selectedIngredients.join(",");
        const update_query: KitchenUpdate = { where: { id: kitchenID }, data: { ingredients_ids: ingredientString } };
        socket.emit("kitchen:update", auth, update_query);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="pb-2" variant={"outline"}>Edit</Button>
            </DialogTrigger>
            <DialogContent className=" min-w-[39vw]">
                <DialogHeader>
                    <DialogTitle>Edit Order</DialogTitle>
                    <DialogDescription>
                        Select
                    </DialogDescription>
                </DialogHeader>
                <div className=" grid grid-cols-3 gap-2">
                    {ingredients_in_menu_item.map((ingredient_in_menu_item) => {
                        const ingredient = ingredients.find((ingredient) => ingredient.id === ingredient_in_menu_item.ingredients_id);
                        if (ingredient) {
                            return (
                                <Button key={ingredient.id} variant={(selectedIngredients.includes(ingredient.id)) ? "default" : "destructive"} className="w-[12vw] h-[10vh] text-xl font-bold whitespace-normal" onClick={() => on_ingredient_click(ingredient.id)}> <p className={(selectedIngredients.includes(ingredient.id)) ? "" : "line-through"}> {ingredient.name}</p> </Button>
                            );
                        }
                    })}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button key="Submit Changes" variant="outline" onClick={() => submitChanges()}>Submit Changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
