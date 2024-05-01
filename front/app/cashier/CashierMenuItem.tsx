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
import { Label } from "@radix-ui/react-label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export default function CashierMenuItem({ menu_item, ingredients, ingredient_menus }: { menu_item: Menu_Item, ingredients: Ingredient[], ingredient_menus: Ingredients_Menu[] }) {
    const cart = useCartStore((state) => state.cart);
    const setCart = useCartStore((state) => state.setCart);
    const [quantity, setQuantity] = useState(1);
    const [maxQuantity, setMaxQuantity] = useState(200);
    const { toast } = useToast();

    const ingredients_in_menu_item = ingredient_menus.filter((ingredient_menu) => ingredient_menu.menu_id === menu_item.id);
    const [selectedIngredients, setSelectedIngredients] = useState<number[]>(ingredients_in_menu_item.map((ingredient_in_menu_item) => ingredient_in_menu_item.ingredients_id));

    // UHH idk why this was here it works without it so im taking it out, it randomly appeared in the merge. -Alex
    useEffect(() => {
        setSelectedIngredients(ingredients_in_menu_item.map((ingredient_in_menu_item) => ingredient_in_menu_item.ingredients_id));
    }, [ingredient_menus]);

    useEffect(() => {
        minimumIngredient(); reset_ingredients();
    }, [ingredients]);

    useEffect(() => {
        reset_ingredients(); resetQuantity(); minimumIngredient();
    }, []);

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

    const updateCart = (menu_item: Menu_Item, ingredient_ids: number[], quantity: number) => {
        const cartItem: CartItem = {
            menu_item: menu_item,
            ingredient_ids: ingredient_ids,
            quantity: quantity
        }

        if (!ingredientChecker()) {
            return toast({
                title: "Uh oh! Something went wrong.",
                description: `You do not have enough ingredients to make this many items. Try making less than ${quantity} or get a manager to create a catering order for the customer.`,
            });
        }

        for (let i = 0; i < cart.length; ++i) {
            if ((cartItem.menu_item.id === cart[i].menu_item.id) && (compare(cartItem.ingredient_ids, cart[i].ingredient_ids))) {
                cart[i].quantity += cartItem.quantity;
                setCart(cart);
                return;
            }
        }

        cart.push(cartItem);
        cart[cart.length - 1].quantity = cartItem.quantity
        setCart(cart);
    }

    function ingredientChecker() {
        let ingredients_in_menu_item = ingredient_menus.filter((ingredient_menu) => ingredient_menu.menu_id === menu_item.id);
        let selectedIngredientIDs = ingredients_in_menu_item.map((ingredient_in_menu_item) => ingredient_in_menu_item.ingredients_id);
        let selectedIngredientQuantities = ingredients_in_menu_item.map((ingredient_in_menu_item) => ingredient_in_menu_item.quantity);
        let selectedIngredients = ingredients.filter((ingredient) => compareNumArray(ingredient.id, selectedIngredientIDs));

        for (let i = 0; i < selectedIngredients.length; ++i) {
            if (!(selectedIngredients[i].stock >= (quantity * selectedIngredientQuantities[i]))) {
                return false;
            }
        }
        return true;
    }

    const compareNumArray = (num: number, array: number[]) => {
        for (let i = 0; i < array.length; ++i) {
            if (array[i] === num) {
                return true;
            }
        }
        return false;
    }

    const resetQuantity = () => {
        setQuantity(1);
    }

    const resetMax = () => {
        setMaxQuantity(1);
    }

    function minimumIngredient() {
        reset_ingredients();
        let requested_stock = Infinity;
        selectedIngredients.forEach(id => {
            const ingredient = ingredients.find(ing => ing.id === id);
            if (ingredient && ingredient.stock < requested_stock) {
                requested_stock = ingredient.stock;
            }
        });
        setMaxQuantity(requested_stock);
        return requested_stock;
    };

    function QuantityInput() {
        const handleChange = (e: any) => {
            e.preventDefault();
            minimumIngredient();
            const newQuantity = parseInt(e.target.value, 10);
            if (newQuantity >= 1) {
                setQuantity(newQuantity);
            }
        };

        return (
            <Input
                type="number"
                min="1"
                value={quantity}
                onChange={handleChange}
                className="text-2xl h-[7vh] w-[8vw]"
            />
        );
    }


    return (
        <Dialog key={menu_item.id} onOpenChange={() => { reset_ingredients(), resetQuantity(), minimumIngredient() }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex-col justify-evenly items-center w-[23vw] h-[10vh]">
                    <h2 className="text-2xl font-bold snap-center">{menu_item.name}</h2>
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
                    <div>
                        <h1 className="text-slate-500 font-bold">Tap to remove/add:</h1>
                        <div className="grid grid-cols-3 gap-4 transition-all justify-end">
                        {ingredients_in_menu_item.map((ingredient_in_menu_item) => {
                            const ingredient = ingredients.find((ingredient) => ingredient.id === ingredient_in_menu_item.ingredients_id);
                            if (ingredient) {
                                return (
                                    <Button key={ingredient.id} variant={(selectedIngredients.includes(ingredient.id)) ? "default" : "destructive"} className="w-[10vw] h-[10vh] text-xl font-bold whitespace-normal" onClick={() => on_ingredient_click(ingredient.id)}> <p className={(selectedIngredients.includes(ingredient.id)) ? "" : "line-through"}> {ingredient.name}</p> </Button>
                                );
                            }
                        })}
                        </div>
                    </div>
                </div>
                <DialogFooter className="justify-between gap-4">
                    {QuantityInput()}

                    {quantity > maxQuantity ? (
                        <div className="warning-label w-[15vw]">
                            <p className="text-red-500">*** Warning ***</p>
                            <p>We only have enough ingredients for {maxQuantity} {menu_item.name}s!</p>
                        </div>
                    ) : (
                        <div>
                            <div className="warning-label w-[15vw]">
                                <p className="text-green-400">In Stock</p>
                                <p>We have enough ingredients to make this order.</p>
                            </div>
                            <DialogClose asChild>
                                <Button
                                    key={"add cart"}
                                    variant={"default"}
                                    className="w-[12vw] h-[8vh] text-xl font-bold whitespace-normal"
                                    onClick={() => updateCart(menu_item, selectedIngredients, quantity)}
                                >
                                    Add to Cart
                                </Button>
                            </DialogClose>
                        </div>
                    )}


                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
