import * as React from 'react';
import { Kitchen } from '@prisma/client';
import { prisma } from '@/lib/db';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export async function EmailTemplate({ kitchen }: { kitchen: Kitchen[] }) {
    const menu_items = await prisma.menu_Item.findMany();
    const ingredients = await prisma.ingredient.findMany();

    function getIngredientNames(kitchenIngredients: string) {
        const ingredientIds = kitchenIngredients.split(",");
        return ingredientIds.map(id => {
            const ingredient = ingredients.find(ingredient => ingredient.id === Number(id));
            return ingredient ? ingredient.name : id.toString();
        }).join(", ");
    }

    return (
        <Card className="w-auto h-auto">
            <CardHeader>
                <CardTitle>#{kitchen[0].order_id}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    {kitchen.map((kitchen) => {
                        const menuItem = menu_items.find(item => item.id === kitchen.menu_id);
                        return (
                            <div key={kitchen.id}>
                                <p className="pt-2">Menu Item: {menuItem ? menuItem.name : `ID ${kitchen.menu_id}`}</p>
                                <p className="pb-2">Ingredients: {getIngredientNames(kitchen.ingredients_ids)}</p>
                            </div>
                        );
                    })}
                </CardDescription>
            </CardContent>
        </Card>
    );
}
