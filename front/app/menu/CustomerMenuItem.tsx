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
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

import { Menu_Item, Ingredient, Ingredients_Menu } from "@prisma/client"
import { useCartStore } from "@/lib/provider/cart-store-provider"
import { CartItem } from "@/lib/stores/cart-store"
import { createWriteStream } from "fs"

export default function CustomerMenuItem({ menu_item, ingredients, ingredient_menus, translated }: { menu_item: Menu_Item, ingredients: Ingredient[], ingredient_menus: Ingredients_Menu[], translated: any }) {
    const cart = useCartStore((state) => state.cart);
    const setCart = useCartStore((state) => state.setCart);
    
    const ingredients_in_menu_item = ingredient_menus.filter((ingredient_menu) => ingredient_menu.menu_id === menu_item.id);
    const [selectedIngredients, setSelectedIngredients] = useState<number[]>(ingredients_in_menu_item.map((ingredient_in_menu_item) => ingredient_in_menu_item.ingredients_id));

    // UHH idk why this was here it works without it so im taking it out, it randomly appeared in the merge. -Alex
    // useEffect(() => {
    //     setSelectedIngredients(ingredients_in_menu_item.map((ingredient_in_menu_item) => ingredient_in_menu_item.ingredients_id));
    // }, [ingredient_menus]);

    const on_ingredient_click = (ingredient_id: number) => {
        if (selectedIngredients.includes(ingredient_id)) {
            setSelectedIngredients(selectedIngredients.filter((selectedIngredient) => selectedIngredient !== ingredient_id));
        } else {
            setSelectedIngredients([...selectedIngredients, ingredient_id]);
        }
    }

    const reset_ingredients = () => {
        setSelectedIngredients(ingredients_in_menu_item.map((ingredient_in_menu_item) => ingredient_in_menu_item.ingredients_id));
    }
    
    const compare = (array1: number[], array2: number[]) => {

        if (array1.length != array2.length) {
            return false;
        }

        for (let i = 0; i < array1.length; ++i) {
            if (array1[i] != array2[i]) {
                return false;
            }
        }

        return true;
    }

    const updateCart = (menu_item: Menu_Item, ingredient_ids: number[]) => {
        const cartItem: CartItem = {
            menu_item: menu_item,
            ingredient_ids: ingredient_ids,
            quantity: 1
        }

        for (let i = 0; i < cart.length; ++i) {
            if ((cartItem.menu_item.id === cart[i].menu_item.id) && (compare(cartItem.ingredient_ids, cart[i].ingredient_ids))) {
                cart[i].quantity += 1;
                setCart(cart);
                return;
            }
        }
        
        cart.push(cartItem);
        setCart(cart);
    }


    return (
        <Dialog key={menu_item.id} onOpenChange={reset_ingredients}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex-col justify-evenly items-center w-[25vw] h-[40vh]">
                    <h2 className="text-2xl font-bold snap-center">{menu_item.name}</h2>
                    <Image
                        src={menu_item.image_url}
                        width={200}
                        height={200}
                        alt={menu_item.name}
                        className="aspect-[1/1] h-[16vh] w-[8vw] object-cover rounded-3xl border" />
                    <h2 className="text-2xl">${menu_item.price}</h2>
                </Button>
            </DialogTrigger>
            <DialogContent className=" min-w-[80vw]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{menu_item.name}</DialogTitle>
                    <DialogDescription className="text-2xl font-bold">${menu_item.price}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-row space-x-12">
                    <Image
                        src={menu_item.image_url}
                        width={500}
                        height={500}
                        alt={menu_item.name}
                        className="aspect-[1/1] h-[500px] w-[500px] object-cover rounded-3xl border"
                    />
                    <div className="grid grid-cols-3 gap-4 transition-all justify-end">
                        {ingredients_in_menu_item.map((ingredient_in_menu_item) => {
                            const ingredient = ingredients.find((ingredient) => ingredient.id === ingredient_in_menu_item.ingredients_id);
                            if (ingredient) {
                                return (
                                    <Button key={ingredient.id} variant={ (selectedIngredients.includes(ingredient.id)) ? "default" : "destructive"} className="w-[10vw] h-[10vh] text-xl font-bold whitespace-normal" onClick={() => on_ingredient_click(ingredient.id)}> <p className={(selectedIngredients.includes(ingredient.id)) ? "" : "line-through"}> {ingredient.name}</p> </Button>
                                );
                            }
                        })}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button key={"add cart"} variant={"default"} className="w-[12vw] h-[8vh] text-xl font-bold whitespace-normal" onClick={() => updateCart(menu_item, selectedIngredients)}>Add to Cart</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}