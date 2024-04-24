"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu_Item, Ingredient, Ingredients_Menu, Users } from "@prisma/client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

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

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { format, set } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import UsersList from "./UsersList";

import { AuthPacket, useSocket, MenuItemDelete, IngredientCreate, IngredientDelete, IngredientsMenuRead } from "@/lib/socket";
import { create } from "domain";


export default function ManagerFunctions({ menu_items_init, categories_init, ingredients_init, menuIngredients_init, users_init, user }: { menu_items_init: Menu_Item[], categories_init: string[], ingredients_init: Ingredient[], menuIngredients_init: Ingredients_Menu[], users_init: Users[], user: Users | null }) {
    const [showEditDiv, setShowEditDiv] = useState(false);
    const [showTrendDiv, setShowTrendDiv] = useState(false);
    const [showEmployeeDiv, setShowEmployeeDiv] = useState(false);
    const [showIngredientDiv, setShowIngredientDiv] = useState(false);
    // const [date, setDate] = useState<Date>();
    const router = useRouter();
    const [itemName, setItemName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [minstock, setMinstock] = useState('');
    const [isactive, setIsactive] = useState('');
    const [ingredientList, setIngredientList] = useState<Ingredient[]>([]);
    const [ratios, setRatios] = useState<number[]>([]);

    const [menu_items, setMenuItems] = useState(menu_items_init);
    const [ingredients, setIngredients] = useState(ingredients_init);
    const [ingredientsMenu, setIngredientsMenu] = useState(menuIngredients_init);
    const [users, setUsers] = useState(users_init);

    // in case we need to listen to something
    const socket = useSocket();
    useEffect(() => {
        if (socket) {
            socket.emit("menuItem:read", undefined, (new_menu_items: Menu_Item[]) => {
                setMenuItems(new_menu_items);
            });

            socket.on("menuItem", (new_menu_items: Menu_Item[]) => {
                setMenuItems(new_menu_items);
            });

            socket.emit('ingredient:read', undefined, (new_ingredients: Ingredient[]) => {
                setIngredients(new_ingredients);
            });

            socket.on('ingredient', (new_ingredients: Ingredient[]) => {
                setIngredients(new_ingredients);
            });

            socket.emit("ingredientMenu:read", undefined, (new_ingredient_menus: Ingredients_Menu[]) => {
                setIngredientsMenu(new_ingredient_menus);
            });

            socket.emit('users:read', undefined, (new_users: Users[]) => {
                setUsers(new_users);
            });

            socket.on('users', (new_users: Users[]) => {
                setUsers(new_users);
            });
        }
    }, [socket]);

    const toggleEditMenuDiv = () => {
        setShowEmployeeDiv(false);
        setShowTrendDiv(false);
        setShowIngredientDiv(false);
        setShowEditDiv(!showEditDiv);
    }

    const toggleIngredientDiv = () => {
        setShowEmployeeDiv(false);
        setShowTrendDiv(false);
        setShowEditDiv(false);
        setShowIngredientDiv(!showIngredientDiv);
    }

    const toggleBoard = () => {
        window.open('/menu_board', '_blank');
    }

    const toggleTrends = () => {
        setShowEmployeeDiv(false);
        setShowEditDiv(false);
        setShowTrendDiv(false);
        setShowIngredientDiv(false);
        router.push("/manager_trends");
    }

    const toggleEmployee = () => {
        setShowTrendDiv(false);
        setShowEditDiv(false);
        setShowIngredientDiv(false);
        setShowEmployeeDiv(!showEmployeeDiv);
    }

    const stringToBool = (str: string): boolean => {
        if (str === "true") return true;
        else return false;
    }

    const auth: AuthPacket = {
        email: user?.email ?? "",
        jwt: user?.jwt ?? ""
    };

    const handleEditMenu = async (e: any) => {
        e.preventDefault();
        const formData = {
            itemName,
            category,
            intPrice: parseInt(price, 10),
            activeConversion: stringToBool(isactive)
        };
    
        console.log("Before emitting:", ingredientList);
        socket?.emit('menuItem:update', auth, {
            name: formData.itemName,
            price: formData.intPrice,
            category: formData.category,
            is_active: formData.activeConversion
        }, ingredientList, ratios, () => {});
        console.log("Emit callback executed");
        setIngredientList([]);
        setRatios([]);
    }

    const handlePreCheck = (menu_item: Menu_Item, ingredient: Ingredient) => {
        return ingredientsMenu.some(item => 
            item.ingredients_id === ingredient.id && item.menu_id === menu_item.id
        );
    }

    const handleInputChange = (e: any, setter: any) => {
        setter(e.target.value);
    }

    const handleEditChange = (e:any, setter: any, attribute: any) => {
        if (e.target.value === '') setter(attribute.target.value);
        else setter(e.target.value)
    }

    const handleCheckBoxChange = (e: any, ingredient: Ingredient) => {
        let newIngArray = ingredientList;
        let newRatioArray = ratios;
        if(newIngArray.includes(ingredient)){
            const index = newIngArray.indexOf(ingredient);
            newIngArray.splice(index, 1);
            setIngredientList(newIngArray);
            newRatioArray.pop();
            console.log("Removed ingredient from list", ingredientList);
        }
        else{
            newIngArray.push(ingredient);
            setIngredientList(newIngArray);
            newRatioArray.push(1);
            setRatios(newRatioArray);
            console.log("Added ingredient to list", ingredientList);
        }
    }

    const handleSubmitMenu = async (e: any) => {
        e.preventDefault();
        const formData = {
            itemName,
            category,
            intPrice: parseInt(price, 10),
            activeConversion: stringToBool(isactive)
        };
    
        console.log("Before emitting:", ingredientList);
        socket?.emit('menuItem:add', auth, {
            name: formData.itemName,
            price: formData.intPrice,
            image_url: '/',
            category: formData.category,
            is_active: formData.activeConversion
        }, ingredientList, ratios, () => {});
        console.log("Emit callback executed");
        setIngredientList([]);
        setRatios([]);
    };

    const handleSubmitIngredient = async (e:any) => {
        e.preventDefault();
        const formData = {
            itemName,
            category,
            intStock: parseInt(stock, 10),
            intMinstock: parseInt(minstock, 10),
            activeConversion: stringToBool(isactive)
        };
        const create_query: IngredientCreate = {
            data: {
                name: itemName,
                stock: formData.intStock,
                min_stock: formData.intMinstock,
                category: category,
                is_active: formData.activeConversion
            }
        };
        socket?.emit('ingredient:create', auth, create_query);
    }    

    const editIngredient = async (ing: Ingredient) => {

    }

    // These work now!!!!!!!!!!!!
    function deleteItem(menu_item: Menu_Item) {
        const update_query: MenuItemDelete = {
            where: {
                name: menu_item.name
            }
        };
        socket?.emit('menuItem:delete', auth, update_query);
    }
    
    function deleteIngredient(ingredient: Ingredient) {
        const update_query: IngredientDelete = {
            where: {
                name: ingredient.name
            }
        };
        socket?.emit('ingredient:delete', auth, update_query);
    }

    return (
        <div className="flex overflow-hidden flex-row gap-4">
            {/* Manager Options */}
            <ScrollArea className="h-[92vh] w-auto p-10 whitespace-nowrap">
                <div className="flex flex-col w-[10vw] space-y-8 justify-center items-center">
                    <p className="text-lg font-bold"> Options </p>
                    <Separator />
                    <Button className="w-[9vw] h-[9vh] text-lg font-bold whitespace-normal" variant={(showEditDiv) ? "default" : "secondary"} onClick={toggleEditMenuDiv}>Edit Menu</Button>
                    <Button className="w-[9vw] h-[9vh] text-lg font-bold whitespace-normal" variant={(showIngredientDiv) ? "default" : "secondary"} onClick={toggleIngredientDiv}>Edit Ingredients</Button>
                    {/* {isadmin && (<Button className="w-[8vw] h-[9vh] text-lg font-bold whitespace-normal" variant={(showEmployeeDiv) ? "default" : "secondary"} onClick={toggleEmployee}>Employees</Button>)} */}
                    <Button className="w-[9vw] h-[9vh] text-lg font-bold whitespace-normal" variant={(showEmployeeDiv) ? "default" : "secondary"} onClick={toggleEmployee}>Employees</Button>
                    <Button className="w-[9vw] h-[9vh] text-lg font-bold whitespace-normal" variant="secondary" onClick={toggleTrends}>Trends</Button>
                    <Button className="w-[9vw] h-[9vh] text-lg font-bold whitespace-normal" variant="secondary" onClick={toggleBoard}>Menu Board</Button>
                </div>
            </ScrollArea>

            {!showEditDiv && !showEmployeeDiv && !showIngredientDiv &&  (
            <ScrollArea className="flex-col w-auto items-center h-[91vh]">
                <h1 className="text-2xl font-bold p-16">Select a function using the buttons on the left.</h1>
            </ScrollArea>)}


















            {/* if editing menu items */}
            {showEditDiv && (
                <ScrollArea className="flex-col w-auto items-center h-[91vh]">
                    <div className="grid grid-cols-1 gap-4 p-4">
                        <Dialog onOpenChange={() => {setIngredientList([]), setRatios([])}}>
                            <div className="flex flex-col w-auto justify-center items-center">
                                <DialogTrigger>
                                    <Button variant="default" className="text-3xl font-bold p-8">Add Item</Button>
                                </DialogTrigger>
                            </div>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="text-lg font-bold">Add New Item</DialogTitle>
                                </DialogHeader>

                                <form onSubmit={handleSubmitMenu}>
                                    <div className="py-2">
                                        <Label htmlFor="itemName">Enter Item Name</Label>
                                        <Input
                                            className="w-64"
                                            placeholder="Type item name here."
                                            id="itemName"
                                            value={itemName}
                                            onChange={(e) => handleInputChange(e, setItemName)}
                                            required
                                            onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Please enter an item name.')}
                                            onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
                                        />
                                    </div>

                                    <div className="py-2">
                                        <Label htmlFor="category">Enter Category</Label>
                                        <Input
                                            className="w-64"
                                            placeholder="Type item category here."
                                            id="category"
                                            value={category}
                                            onChange={(e) => handleInputChange(e, setCategory)}
                                            required
                                            onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Please enter an item category.')}
                                            onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
                                        />
                                    </div>

                                    <div className="py-2">
                                        <Label htmlFor="price">Enter Price</Label>
                                        <Input
                                            className="w-64"
                                            placeholder="Type item price here."
                                            id="price"
                                            value={price}
                                            onChange={(e) => handleInputChange(e, setPrice)}
                                            required
                                            onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Please enter an item price.')}
                                            onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
                                        />
                                    </div>

                                    <div className="py-2">
                                        <Label htmlFor="price">Is this menu item active? (true or false)</Label>
                                        <Input
                                            className="w-64"
                                            placeholder="true or false"
                                            id="isactive"
                                            value={isactive}
                                            onChange={(e) => handleInputChange(e, setIsactive)}
                                            required
                                            onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Please specify if item is active.')}
                                            onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
                                        />
                                    </div>

                                    {/* <div className="py-2">
                                        <Label htmlFor="date">Enter Seasonal Item End Date</Label>
                                        <Popover modal={true}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[280px] justify-start text-left font-normal",
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date ? format(date, "PPP") : <span>Select Date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div> */}

                                    <ScrollArea className="py-2 h-[40vh] w-100 p-2 whitespace-nowrap border-2 rounded-lg">
                                        <div className="flex-col space-y-4">
                                            {ingredients.map((item, index) => (
                                                <div key={index} className="flex items-center">
                                                    <Checkbox
                                                        id={(item.id).toString()}
                                                        onClick={(e) => handleCheckBoxChange(e, item)}
                                                    />
                                                    <label htmlFor={(item.id).toString()} className="p-2">{item.name}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>

                                    <div className="py-2 flex items-center gap-4">
                                        <DialogClose asChild>
                                            <Button variant="default" type="submit">Add Item</Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button variant="destructive" onClick={() => {setIngredientList([]), setRatios([])}} >Cancel</Button>
                                        </DialogClose>
                                    </div>

                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {menu_items.map((menu_item) => (
                            <Dialog key={menu_item.id} onOpenChange={() => {setIngredientList([]), setRatios([])}}>
                                <div className="flex flex-col w-[25vw] h-[12vh] border-solid border-2 rounded-lg hover:bg-foreground/5 transition-all">
                                    <div className="flex flex-col w-[25vw] h-[12vh] justify-center items-center">
                                        <h2 className="text-base font-bold snap-center">{menu_item.name}</h2>
                                        <h2 className="text-base snap-center">
                                            {menu_item.is_active ? <div className="text-green-500">Active</div> : <div className="text-red-700">Inactive</div>}
                                        </h2>
                                        <div className="flex justify-center items-center gap-4">
                                            <DialogTrigger asChild>
                                                <Button variant="default" >Edit</Button>
                                            </DialogTrigger>
                                            <AlertDialog>
                                                <AlertDialogTrigger>
                                                    <Button variant="destructive">
                                                        Delete
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the menu item
                                                            and remove its data from our server.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <Button variant="destructive" onClick={() => deleteItem(menu_item)}>
                                                            Continue
                                                        </Button>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </div>

                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="text-lg font-bold">Edit Menu Item</DialogTitle>
                                    </DialogHeader>

                                <form onSubmit={handleEditMenu}>
                                    
                                    <div className="py-2">
                                        <Label htmlFor="itemName">Change Item Name</Label>
                                        <Input
                                            className="w-64"
                                            placeholder={menu_item.name}
                                            id="itemName"
                                            value={itemName}
                                            onChange={(e) => handleEditChange(e, setItemName, menu_item.name)}
                                        />
                                    </div>


                                    <div className="py-2">
                                        <Label htmlFor="category">Change Item Category</Label>
                                        <Input
                                            className="w-64"
                                            placeholder={menu_item.category}
                                            id="category"
                                            value={category}
                                            onChange={(e) => handleEditChange(e, setCategory, menu_item)}
                                        />
                                    </div>

                                    <div className="py-2">
                                        <Label htmlFor="price">Change Item Price</Label>
                                        <Input
                                            className="w-64"
                                            placeholder={(menu_item.price).toString()}
                                            id="price"
                                            value={price}
                                            onChange={(e) => handleEditChange(e, setPrice, (menu_item.price).toString())}
                                        />
                                    </div>

                                    <div className="py-2">
                                        <Label htmlFor="isactive">Is this menu item active? (true or false)</Label>
                                        <Input
                                            className="w-64"
                                            placeholder={(menu_item.is_active).toString()}
                                            id="isactive"
                                            value={isactive}
                                            onChange={(e) => handleEditChange(e, setIsactive, (menu_item.is_active).toString())}
                                        />
                                    </div>

                                    {/* <div>
                                        <Label htmlFor="message">Change Seasonal Item End Date</Label>
                                        <Popover modal={true}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[280px] justify-start text-left font-normal",
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date ? format(date, "PPP") : <span>Select Date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div> */}

                                    <ScrollArea className="h-[40vh] w-100 p-2 whitespace-nowrap overflow-auto border-2 rounded-lg">
                                        <div className="flex-col space-y-4">
                                            {ingredients.map((item, index) => (
                                                <div key={index} className="flex items-center">
                                                    <Checkbox
                                                        id={(item.id).toString()}
                                                        //checked={handlePreCheck(menu_item, item) || false}
                                                        onClick={(e) => handleCheckBoxChange(e, item)}
                                                    />
                                                    <label htmlFor={(item.id).toString()} className="p-2">{item.name}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>


                                    <div className="flex items-center gap-4">
                                        <DialogClose asChild>
                                            <Button variant="default" type="submit">Edit Item</Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button variant="destructive" onClick={() => {setIngredientList([]), setRatios([])}}>Cancel</Button>
                                        </DialogClose>
                                    </div>
                                    <DialogFooter>

                                    </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </div>
                </ScrollArea>
            )}





























            {showIngredientDiv && (
                <ScrollArea className="flex-col w-auto items-center h-[91vh]">
                    <div className="grid grid-cols-1 gap-4 p-4">
                        <Dialog>
                            <div className="flex flex-col w-auto justify-center items-center">
                                <DialogTrigger>
                                    <Button variant="default" className="text-3xl font-bold p-8">Add Ingredient</Button>
                                </DialogTrigger>
                            </div>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="text-lg font-bold">Add New Ingredient</DialogTitle>
                                </DialogHeader>

                                <form onSubmit={handleSubmitIngredient}>
                                    <div className="py-2">
                                        <Label htmlFor="itemName">Enter Ingredient Name</Label>
                                        <Input
                                            className="w-64"
                                            placeholder="Type ingredient name here."
                                            id="ingredientName"
                                            value={itemName}
                                            onChange={(e) => handleInputChange(e, setItemName)}
                                        />
                                    </div>

                                    <div className="py-2">
                                        <Label htmlFor="category">Enter Category</Label>
                                        <Input
                                            className="w-64"
                                            placeholder="Type ingredient category."
                                            id="category"
                                            value={category}
                                            onChange={(e) => handleInputChange(e, setCategory)}
                                        />
                                    </div>

                                    <div className="py-2">
                                        <Label htmlFor="stock">Enter Stock</Label>
                                        <Input
                                            className="w-64"
                                            placeholder="Type ingredient stock."
                                            id="stock"
                                            value={stock}
                                            onChange={(e) => handleInputChange(e, setStock)}
                                        />
                                    </div>

                                    <div className="py-2">
                                        <Label htmlFor="minstock">Enter Minimum Stock Necessary</Label>
                                        <Input
                                            className="w-64"
                                            placeholder="Type minimum stock here."
                                            id="minstock"
                                            value={minstock}
                                            onChange={(e) => handleInputChange(e, setMinstock)}
                                        />
                                    </div>

                                    <div className="py-2">
                                        <Label htmlFor="active">Is this ingredient active? (true or false)</Label>
                                        <Input
                                            className="w-64"
                                            placeholder="true or false"
                                            id="active"
                                            value={isactive}
                                            onChange={(e) => handleInputChange(e, setIsactive)}
                                        />
                                    </div>

                                    <div className="py-2 flex items-center gap-4">
                                        <DialogClose asChild>
                                            <Button variant="default" type="submit">Add Ingredient</Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button variant={"destructive"} >Cancel</Button>
                                        </DialogClose>
                                    </div>

                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {ingredients.map((ingredient) => (
                            <Dialog key={ingredient.id}>
                                <div className="flex flex-col w-[25vw] h-[12vh] border-solid border-2 rounded-lg hover:bg-foreground/5 transition-all">
                                    <div className="flex flex-col w-[25vw] h-[12vh] justify-center items-center">
                                        <h2 className="text-base font-bold snap-center">{ingredient.name}</h2>
                                        <h2 className="text-base snap-center">
                                            {ingredient.is_active ? <div className="text-green-500">Active</div> : <div className="text-red-700">Inactive</div>}
                                        </h2>
                                        <div className="flex justify-center items-center gap-4">
                                            <DialogTrigger asChild>
                                                <Button variant="default" onClick={() => editIngredient(ingredient)}>Edit</Button>
                                            </DialogTrigger>
                                            <AlertDialog>
                                                <AlertDialogTrigger>
                                                    <Button variant="destructive">
                                                        Delete
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the ingredient
                                                            and remove its data from our server.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <Button variant="destructive" onClick={() => deleteIngredient(ingredient)}>
                                                            Continue
                                                        </Button>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </div>

                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="text-lg font-bold">Edit Ingredient</DialogTitle>
                                    </DialogHeader>

                                    <div>
                                        <Label htmlFor="name">Change Item Name</Label>
                                        <Input className="w-64" placeholder={ingredient.name} id="name" />
                                    </div>

                                    <div>
                                        <Label htmlFor="category">Change Category</Label>
                                        <Input className="w-64" placeholder={ingredient.category} id="category" />
                                    </div>

                                    <div>
                                        <Label htmlFor="stock">Change Stock</Label>
                                        <Input className="w-64" placeholder={(ingredient.stock).toString()} id="stock" />
                                    </div>

                                    <div>
                                        <Label htmlFor="minstock">Change Minimum Stock</Label>
                                        <Input className="w-64" placeholder={(ingredient.min_stock).toString()} id="minstock" />
                                    </div>

                                    <div>
                                        <Label htmlFor="active">Is this ingredient active? (true or false)</Label>
                                        <Input className="w-64" placeholder={(ingredient.is_active).toString()} id="active" />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <DialogClose asChild>
                                            <Button variant="default" onClick={() => editIngredient(ingredient)}>Edit Ingredient</Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button variant={"destructive"} >Cancel</Button>
                                        </DialogClose>
                                    </div>
                                    <DialogFooter>

                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </div>
                </ScrollArea>
            )}

            {/* Employee management */}
            {showEmployeeDiv && (
                <UsersList users={users} user={user} />
            )}
        </div>
    );
}
