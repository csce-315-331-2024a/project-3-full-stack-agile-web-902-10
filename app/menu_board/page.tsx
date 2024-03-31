import { prisma } from "@/lib/db";
import { Menu_Item } from "@prisma/client";


export default async function menu_board() {
    const menu_items = await prisma.menu_Item.findMany();
    const categories = Array.from(new Set(menu_items.map((item) => item.category)));
    
    
    return (
    <div> {/*Not implemented ;C*/}
        {menu_items.filter((menu_item) => menu_item.name === "Bacon Cheeseburger").map((menu_item) => (
            <h2 className="text-xl text-wrap text-left">{menu_item.category}</h2>
        ))}
    </div>
    );
}

