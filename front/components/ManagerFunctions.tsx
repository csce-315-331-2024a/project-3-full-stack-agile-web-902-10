"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu_Item, Ingredient, Ingredients_Menu, Users, Roles } from "@prisma/client";
import { useState, useEffect, ChangeEvent } from "react";
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
import Image from "next/image";
import OrderHistoryDesktop from "@/app/order_history/OrderHistoryDesktop";
import LoginLogDesktop from "@/app/login_log/LoginLogDesktop";

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

import { AuthPacket, useSocket, MenuItemDelete, IngredientCreate, IngredientDelete, IngredientsMenuRead, MenuItemUpdate, IngredientUpdate, IngredientsMenuDelete, IngredientsMenuCreate } from "@/lib/socket";
import { create } from "domain";
import { ifError } from "assert";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/lib/imageFB";

export default function ManagerFunctions({ menu_items_init, categories_init, ingredients_init, menuIngredients_init, users_init, user }: { menu_items_init: Menu_Item[], categories_init: string[], ingredients_init: Ingredient[], menuIngredients_init: Ingredients_Menu[], users_init: Users[], user: Users | null }) {
    const [showEditDiv, setShowEditDiv] = useState(false);
    const [showTrendDiv, setShowTrendDiv] = useState(false);
    const [showEmployeeDiv, setShowEmployeeDiv] = useState(false);
    const [showIngredientDiv, setShowIngredientDiv] = useState(false);
    const [showIngredientScroll, setShowIngredientScroll] = useState(false);
    const [showOrder, setShowOrder] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    // const [date, setDate] = useState<Date>();
    const router = useRouter();
    const [itemName, setItemName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [minstock, setMinstock] = useState('');
    const [uploadedimageURL, setUploadedImageURL] = useState('');
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

    const toggleLogin = () => {
        setShowEmployeeDiv(false);
        setShowTrendDiv(false);
        setShowIngredientDiv(false);
        setShowEditDiv(false);
        setShowOrder(false);
        setShowLogin(!showLogin);
    }

    const toggleOrder = () => {
        setShowEmployeeDiv(false);
        setShowTrendDiv(false);
        setShowIngredientDiv(false);
        setShowEditDiv(false);
        setShowLogin(false);
        setShowOrder(!showOrder);
    }

    const toggleEditMenuDiv = () => {
        setShowEmployeeDiv(false);
        setShowTrendDiv(false);
        setShowIngredientDiv(false);
        setShowOrder(false);
        setShowLogin(false);
        setShowEditDiv(!showEditDiv);
    }

    const toggleIngredientDiv = () => {
        setShowEmployeeDiv(false);
        setShowTrendDiv(false);
        setShowEditDiv(false);
        setShowOrder(false);
        setShowLogin(false);
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
        setShowOrder(false);
        setShowLogin(false);
        router.push("/manager_trends");
    }

    const toggleEmployee = () => {
        setShowTrendDiv(false);
        setShowEditDiv(false);
        setShowIngredientDiv(false);
        setShowOrder(false);
        setShowLogin(false);
        setShowEmployeeDiv(!showEmployeeDiv);
    }

    const auth: AuthPacket = {
        email: user?.email ?? "",
        jwt: user?.jwt ?? ""
    };

    const handleInputChange = (e: any, setter: any) => {
        setter(e.target.value);
    }

    const handleImage = (e: ChangeEvent<HTMLInputElement>, setter: any) => {
        if (e.target.files === null) {
            return;
        }
        const file = e.target.files[0];

        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);

        const imagename = new Date().getTime().toString() + ".webp";
        const imgref = ref(storage, imagename);

        const uploadtask = uploadBytes(imgref, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                setUploadedImageURL(downloadURL);
            });
        });
    }

    const handleCheckBoxChange = (ingredient: Ingredient) => {
        let newIngArray = ingredientList;
        let newRatioArray = ratios;
        if (newIngArray.includes(ingredient)) {
            const index = newIngArray.indexOf(ingredient);
            newIngArray.splice(index, 1);
            setIngredientList(newIngArray);
            newRatioArray.pop();
            console.log("Removed ingredient from list", ingredientList);
        }
        else {
            newIngArray.push(ingredient);
            setIngredientList(newIngArray);
            newRatioArray.push(1);
            setRatios(newRatioArray);
            console.log("Added ingredient to list", ingredientList);
        }
    }

    const handleSubmitMenu = async (e: any, url: string) => {
        e.preventDefault();
        const formData = {
            itemName,
            category,
            url,
            intPrice: parseInt(price, 10)
        };

        console.log("URL: ", url);
        console.log("Before emitting:", ingredientList);
        socket?.emit('menuItem:add', auth, {
            name: formData.itemName,
            price: formData.intPrice,
            image_url: formData.url,
            category: formData.category,
            is_active: true
        }, ingredientList, ratios, () => { });
        console.log("Emit callback executed", ingredientList);
        setIngredientList([]);
        setRatios([]);
    };

    const handleEditMenu = async (e: any, menu_item: Menu_Item) => {
        e.preventDefault();
        if (ingredientList.length > 0) {
            console.log("Before emitting clear:", ingredientList);
            socket?.emit('menuItem:clear', auth, menu_item);
            console.log("After clear: ", ingredientList);

            ingredientList.forEach((ing) => {
                const create_query: IngredientsMenuCreate = {
                    data: {
                        menu_id: menu_item.id,
                        ingredients_id: ing.id,
                        quantity: 1
                    }
                };
                socket?.emit('ingredientMenu:create', auth, create_query);
            });
        }
        else {
            const formData = {
                itemName,
                category,
                price,
                uploadedimageURL,
            };
            const update_query: MenuItemUpdate = {
                where: {
                    id: menu_item.id
                },
                data: {
                    name: (formData.itemName == '' ? menu_item.name : formData.itemName),
                    category: (formData.category == '' ? menu_item.category : formData.category),
                    price: parseInt((formData.price == '' ? (menu_item.price).toString() : formData.price), 10),
                    image_url: (formData.uploadedimageURL == '' ? menu_item.image_url : formData.uploadedimageURL)
                }
            }
            console.log("Editing attributes with: ", update_query.data.name, update_query.data.category, update_query.data.price);
            socket?.emit('menuItem:update', auth, update_query, () => { });
            console.log("Emit menuItem:update callback executed");
        }
    };

    const handleSubmitIngredient = async (e: any) => {
        e.preventDefault();
        const formData = {
            itemName,
            category,
            intStock: parseInt(stock, 10),
            intMinstock: parseInt(minstock, 10)
        };
        const create_query: IngredientCreate = {
            data: {
                name: itemName,
                stock: formData.intStock,
                min_stock: formData.intMinstock,
                category: category,
                is_active: true
            }
        };
        socket?.emit('ingredient:create', auth, create_query);
    }

    const handleSubmitEditIngredient = async (e: any, ing: Ingredient) => {
        e.preventDefault();
        const formData = {
            itemName,
            category,
            stock,
            minstock
        };
        const update_query: IngredientUpdate = {
            where: {
                id: ing.id
            },
            data: {
                name: (formData.itemName == '' ? ing.name : formData.itemName),
                category: (formData.category == '' ? ing.category : formData.category),
                stock: parseInt((formData.stock == '' ? (ing.stock).toString() : formData.stock), 10),
                min_stock: parseInt((formData.minstock == '' ? (ing.min_stock).toString() : formData.minstock), 10),
            }
        }
        console.log("Editing attributes with: ", update_query.data.name, update_query.data.category, update_query.data.stock, update_query.data.min_stock);
        socket?.emit('ingredient:update', auth, update_query, () => { });
        console.log("Emit menuItem:update callback executed");
    }

    function deactivateItem(menu_item: Menu_Item) {
        const update_query: MenuItemUpdate = {
            where: {
                name: menu_item.name
            },
            data: {
                is_active: false
            }
        };
        socket?.emit('menuItem:update', auth, update_query);
    }

    function activateItem(menu_item: Menu_Item) {
        const update_query: MenuItemUpdate = {
            where: {
                name: menu_item.name
            },
            data: {
                is_active: true
            }
        };
        socket?.emit('menuItem:update', auth, update_query);
    }

    function deactivateIngredient(ingredient: Ingredient) {
        const update_query: IngredientUpdate = {
            where: {
                name: ingredient.name
            },
            data: {
                is_active: false
            }
        };
        socket?.emit('ingredient:update', auth, update_query);
    }

    function activateIngredient(ingredient: Ingredient) {
        const update_query: IngredientUpdate = {
            where: {
                name: ingredient.name
            },
            data: {
                is_active: true
            }
        };
        socket?.emit('ingredient:update', auth, update_query);
    }

    return (
        <div className="flex h-[90vh] overflow-hidden flex-row gap-4">
            {/* Manager Options */}
            <ScrollArea className="h-[92vh] w-auto p-10 whitespace-nowrap">
                <div className="flex flex-col w-[10vw] space-y-8 justify-center items-center">
                    <p className="text-lg font-bold"> Options </p>
                    <Separator />
                    <Button className="w-[9vw] h-[9vh] text-lg font-bold whitespace-normal" variant={(showEditDiv) ? "default" : "secondary"} onClick={toggleEditMenuDiv}>Edit Menu</Button>
                    <Button className="w-[9vw] h-[9vh] text-lg font-bold whitespace-normal" variant={(showIngredientDiv) ? "default" : "secondary"} onClick={toggleIngredientDiv}>Edit Ingredients</Button>
                    {user?.role === Roles.Admin && (<Button className="w-[9vw] h-[9vh] text-lg font-bold whitespace-normal" variant={(showEmployeeDiv) ? "default" : "secondary"} onClick={toggleEmployee}>Employees</Button>)}
                    <Button className="w-[9vw] h-[9vh] text-lg font-bold whitespace-normal" variant="secondary" onClick={toggleTrends}>Trends</Button>
                    <Button className="w-[9vw] h-[9vh] text-lg font-bold whitespace-normal" variant="secondary" onClick={(e) => router.push("/kitchen")}>Kitchen</Button>
                    <Button className="w-[9vw] h-[9vh] text-lg font-bold whitespace-normal" variant={(showOrder) ? "default" : "secondary"} onClick={toggleOrder}>Order History</Button>
                    <Button className="w-[9vw] h-[9vh] text-lg font-bold whitespace-normal" variant={(showLogin) ? "default" : "secondary"} onClick={toggleLogin}>Login History</Button>
                    <Button className="w-[9vw] h-[9vh] text-lg font-bold whitespace-normal" variant="secondary" onClick={toggleBoard}>Menu Board</Button>
                </div>
            </ScrollArea>

            {!showEditDiv && !showEmployeeDiv && !showIngredientDiv && !showOrder && !showLogin && (
                <ScrollArea className="flex-col w-auto items-center h-[91vh]">
                    <h1 className="text-2xl font-bold p-16">Select a function using the buttons on the left.</h1>
                </ScrollArea>)}


















            {/* if editing menu items */}
            {showEditDiv && (
                <ScrollArea className="flex-col w-auto items-center h-[91vh]">
                    <div className="grid grid-cols-1 gap-4 p-4">
                        <Dialog>
                            <div className="flex flex-col w-auto justify-center items-center">
                                <DialogTrigger onClick={() => { setIngredientList([]), setRatios([]), setUploadedImageURL('') }}>
                                    <Button variant="default" className="text-3xl font-bold p-8">Add Item</Button>
                                </DialogTrigger>
                            </div>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="text-lg font-bold">Add New Item</DialogTitle>
                                </DialogHeader>

                                <form onSubmit={(e) => handleSubmitMenu(e, uploadedimageURL)}>
                                    <div className="py-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="itemName">Enter Item Name</Label>
                                            <p className="text-red-500">*</p>
                                        </div>
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
                                        <div className="flex items-center">
                                            <Label htmlFor="category">Enter Category</Label>
                                            <p className="text-red-500">*</p>
                                        </div>
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
                                        <div className="flex items-center">
                                            <Label htmlFor="price">Enter Price</Label>
                                            <p className="text-red-500">*</p>
                                        </div>
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

                                    <div className="">
                                        <div className="flex items-center">
                                            <Label htmlFor="picture">Select Picture (.webp only)</Label>
                                            <p className="text-red-500">*</p>
                                        </div>
                                        {uploadedimageURL === '' ?
                                            <input
                                                id="picture"
                                                type="file"
                                                className="w-64 pb-2"
                                                placeholder="Select an image"
                                                value={uploadedimageURL}
                                                onChange={(e) => handleImage(e, setUploadedImageURL)}
                                                required
                                                onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Please select an image.')}
                                                onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
                                            />
                                            : uploadedimageURL
                                        }
                                    </div>

                                    <div>
                                        <div className="flex items-center py-2">
                                            <Label>Select Ingredients</Label>
                                        </div>
                                        <ScrollArea className="py-2 h-[25vh] w-100 p-2 whitespace-nowrap border-2 rounded-lg">
                                            <div className="flex-col space-y-4">
                                                {ingredients.map((item, index) => (
                                                    <div key={index} className="flex items-center">
                                                        <Checkbox
                                                            id={(item.id).toString()}
                                                            onClick={() => handleCheckBoxChange(item)}
                                                        />
                                                        <label htmlFor={(item.id).toString()} className="p-2">{item.name}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>

                                    <div className="py-2 flex items-center gap-4">
                                        <DialogClose asChild onAbort={() => { setIngredientList([]), setRatios([]) }}>
                                            <Button variant="default" type="submit">Add Item</Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button variant="destructive" onClick={() => { setIngredientList([]), setRatios([]) }} >Cancel</Button>
                                        </DialogClose>
                                    </div>

                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {menu_items.map((menu_item) => (
                            <div key={menu_item.id}>
                                <div className="flex flex-col w-[25vw] border-solid border-2 rounded-lg hover:bg-foreground/5 transition-all">
                                    <div className="flex flex-col w-[25vw] h-[30vh] justify-center items-center">
                                        <h2 className="text-base font-bold snap-center">{menu_item.name}</h2>
                                        <Image
                                            src={menu_item.image_url}
                                            width={150}
                                            height={150}
                                            alt={menu_item.name}
                                            className="aspect-[1/1] h-auto w-auto object-cover rounded-3xl border"
                                        />
                                        <h2 className="text-base snap-center">
                                            {menu_item.is_active ? <div className="text-green-500">Active</div> : <div className="text-red-500">Inactive</div>}
                                        </h2>
                                        <div className="flex justify-center items-center gap-4">
                                            <Dialog>
                                                <DialogTrigger onClick={() => { setIngredientList([]), setRatios([]), setShowIngredientScroll(false) }}>
                                                    <Button variant="default">Edit</Button>
                                                </DialogTrigger>

                                                <DialogContent onAbort={() => { setIngredientList([]), setRatios([]), setShowIngredientScroll(false) }}>

                                                    <DialogHeader>
                                                        <DialogTitle className="text-lg font-bold">Edit Menu Item</DialogTitle>
                                                    </DialogHeader>

                                                    <DialogDescription>
                                                        Fill only the fields that you desire to change.
                                                    </DialogDescription>

                                                    <form onSubmit={(e) => handleEditMenu(e, menu_item)}>

                                                        <div className="py-2">
                                                            <Label htmlFor="itemName">Change Item Name</Label>
                                                            <Input
                                                                className="w-64"
                                                                placeholder={menu_item.name}
                                                                id="itemName"
                                                                value={itemName}
                                                                onChange={(e) => handleInputChange(e, setItemName)}
                                                            />
                                                        </div>

                                                        <div className="py-2">
                                                            <Label htmlFor="category">Change Item Category</Label>
                                                            <Input
                                                                className="w-64"
                                                                placeholder={menu_item.category}
                                                                id="category"
                                                                value={category}
                                                                onChange={(e) => handleInputChange(e, setCategory)}
                                                            />
                                                        </div>

                                                        <div className="py-2">
                                                            <Label htmlFor="price">Change Item Price</Label>
                                                            <Input
                                                                className="w-64"
                                                                placeholder={(menu_item.price).toString()}
                                                                id="price"
                                                                value={price}
                                                                onChange={(e) => handleInputChange(e, setPrice)}
                                                            />
                                                        </div>

                                                        <div className="">
                                                            <div className="flex items-center py-2">
                                                                <Label htmlFor="picture">Change Picture (.webp only)</Label>
                                                            </div>
                                                            {uploadedimageURL === '' ?
                                                                <input
                                                                    id="picture"
                                                                    type="file"
                                                                    className="w-64 pb-2"
                                                                    placeholder="Select an image"
                                                                    value={uploadedimageURL}
                                                                    onChange={(e) => handleImage(e, setUploadedImageURL)}
                                                                />
                                                                : uploadedimageURL
                                                            }
                                                        </div>

                                                        <div className="py-2 flex items-center">
                                                            <Checkbox className="p-2" id="showdiv" onClick={(e) => setShowIngredientScroll(!showIngredientScroll)} />
                                                            <label className="p-2" htmlFor="showdiv">Change Ingredients?</label>
                                                        </div>

                                                        {showIngredientScroll && (
                                                            <div className="py-2">
                                                                <Label>Select all desired ingredients</Label>
                                                                <ScrollArea className=" py-2 h-[40vh] w-100 p-2 whitespace-nowrap border-2 rounded-lg">
                                                                    <div className="flex-col space-y-4">
                                                                        {ingredients.map((item, index) => (
                                                                            <div key={index} className="flex items-center">
                                                                                <Checkbox
                                                                                    id={(item.id).toString()}
                                                                                    // checked={handlePreCheck(curr_menu_item, item)}
                                                                                    onClick={() => handleCheckBoxChange(item)}
                                                                                />
                                                                                <label htmlFor={(item.id).toString()} className="p-2">{item.name}</label>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </ScrollArea>
                                                            </div>
                                                        )}

                                                        <div className="py-2 flex items-center gap-4">
                                                            <DialogClose asChild onAbort={() => { setIngredientList([]), setRatios([]), setShowIngredientScroll(false) }}>
                                                                <Button variant="default" type="submit">Edit Item</Button>
                                                            </DialogClose>
                                                            <DialogClose asChild onAbort={() => { setIngredientList([]), setRatios([]), setShowIngredientScroll(false) }}>
                                                                <Button variant="destructive" onClick={() => { setIngredientList([]), setRatios([]), setShowIngredientScroll(false) }}>Cancel</Button>
                                                            </DialogClose>
                                                        </div>

                                                        <DialogFooter>

                                                        </DialogFooter>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>

                                            <AlertDialog>
                                                <AlertDialogTrigger>
                                                    {menu_item.is_active ? <Button variant="destructive" className="bg-red-500">Deactivate</Button> : <Button variant="default">Activate</Button>}
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action will change the status of the menu item. This will alter trend
                                                            data and change the visibilty of the records of this item. This action can be reversed.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogCancel className="bg-red-500 text-white" onClick={() => { menu_item.is_active ? deactivateItem(menu_item) : activateItem(menu_item) }}>
                                                            Continue
                                                        </AlertDialogCancel>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </div>


                            </div>
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

                                <DialogDescription>
                                    All fields are required.
                                </DialogDescription>

                                <form onSubmit={handleSubmitIngredient}>
                                    <div className="py-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="itemName">Enter Ingredient</Label>
                                            <p className="text-red-500">*</p>
                                        </div>
                                        <Input
                                            className="w-64"
                                            placeholder="Type ingredient name here."
                                            id="ingredientName"
                                            value={itemName}
                                            onChange={(e) => handleInputChange(e, setItemName)}
                                            required
                                            onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Please enter an ingredient name.')}
                                            onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
                                        />
                                    </div>

                                    <div className="py-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="category">Enter Category</Label>
                                            <p className="text-red-500">*</p>
                                        </div>
                                        <Input
                                            className="w-64"
                                            placeholder="Type ingredient category."
                                            id="category"
                                            value={category}
                                            onChange={(e) => handleInputChange(e, setCategory)}
                                            required
                                            onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Please enter an ingredient category.')}
                                            onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
                                        />
                                    </div>

                                    <div className="py-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="stock">Enter Stock</Label>
                                            <p className="text-red-500">*</p>
                                        </div>
                                        <Input
                                            className="w-64"
                                            placeholder="Type ingredient stock."
                                            id="stock"
                                            value={stock}
                                            onChange={(e) => handleInputChange(e, setStock)}
                                            required
                                            onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Please enter the ingredient stock.')}
                                            onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
                                        />
                                    </div>

                                    <div className="py-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="minstock">Enter Minimum Stock Necessary</Label>
                                            <p className="text-red-500">*</p>
                                        </div>
                                        <Input
                                            className="w-64"
                                            placeholder="Type minimum stock here."
                                            id="minstock"
                                            value={minstock}
                                            onChange={(e) => handleInputChange(e, setMinstock)}
                                            required
                                            onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Please enter a minimum ingredient stock.')}
                                            onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
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
                            <div key={ingredient.id}>
                                <div className="flex flex-col w-[25vw] h-[12vh] border-solid border-2 rounded-lg hover:bg-foreground/5 transition-all">
                                    <div className="flex flex-col w-[25vw] h-[12vh] justify-center items-center">
                                        <h2 className="text-base font-bold snap-center">{ingredient.name}</h2>
                                        <h2 className="text-base snap-center">
                                            {ingredient.is_active ? <div className="text-green-500">Active</div> : <div className="text-red-700">Inactive</div>}
                                        </h2>
                                        <div className="flex justify-center items-center gap-4">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="default">Edit</Button>
                                                </DialogTrigger>

                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle className="text-lg font-bold">Edit Ingredient</DialogTitle>
                                                    </DialogHeader>

                                                    <form onSubmit={(e) => handleSubmitEditIngredient(e, ingredient)}>
                                                        <div className="py-2">
                                                            <Label htmlFor="ingredientName">Enter Ingredient Name</Label>
                                                            <Input
                                                                className="w-64"
                                                                placeholder={ingredient.name}
                                                                id="ingredientName"
                                                                value={itemName}
                                                                onChange={(e) => handleInputChange(e, setItemName)}
                                                            />
                                                        </div>

                                                        <div className="py-2">
                                                            <Label htmlFor="category">Enter Category</Label>
                                                            <Input
                                                                className="w-64"
                                                                placeholder={ingredient.category}
                                                                id="category"
                                                                value={category}
                                                                onChange={(e) => handleInputChange(e, setCategory)}
                                                            />
                                                        </div>

                                                        <div className="py-2">
                                                            <Label htmlFor="stock">Enter Stock</Label>
                                                            <Input
                                                                className="w-64"
                                                                placeholder={(ingredient.stock).toString()}
                                                                id="stock"
                                                                value={stock}
                                                                onChange={(e) => handleInputChange(e, setStock)}
                                                            />
                                                        </div>

                                                        <div className="py-2">
                                                            <Label htmlFor="minstock">Enter Minimum Stock Necessary</Label>
                                                            <Input
                                                                className="w-64"
                                                                placeholder={(ingredient.min_stock).toString()}
                                                                id="minstock"
                                                                value={minstock}
                                                                onChange={(e) => handleInputChange(e, setMinstock)}
                                                            />
                                                        </div>

                                                        <div className="py-2 flex items-center gap-4">
                                                            <DialogClose asChild>
                                                                <Button variant="default" type="submit">Edit Ingredient</Button>
                                                            </DialogClose>
                                                            <DialogClose asChild>
                                                                <Button variant={"destructive"} >Cancel</Button>
                                                            </DialogClose>
                                                        </div>

                                                    </form>
                                                </DialogContent>
                                            </Dialog>


                                            <AlertDialog>
                                                <AlertDialogTrigger>
                                                    {ingredient.is_active ? <Button variant="destructive" className="bg-red-500">Deactivate</Button> : <Button variant="default">Activate</Button>}
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action will change the status of the ingredient. This will alter trend
                                                            data and change the visibilty of the records of this item. This action can be reversed.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogCancel className="bg-red-500 text-white" onClick={() => { ingredient.is_active ? deactivateIngredient(ingredient) : activateIngredient(ingredient) }}>
                                                            Continue
                                                        </AlertDialogCancel>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            )}

            {/* Employee management */}
            {showEmployeeDiv && (
                <UsersList users={users} user={user} />
            )}

            {/* Order log */}
            {showOrder && (
                <ScrollArea className="w-[90vw]">
                    <OrderHistoryDesktop/>
                </ScrollArea>
            )}

            {/* lgin history */}
            {showLogin && (
                <ScrollArea className="w-[90vw]">
                    <LoginLogDesktop/>
                </ScrollArea>
            )}
        </div>
    );
}
