import ManagerTrends from "@/components/ManagerTrends";
import { prisma } from "@/lib/db";
import { RestockReportData, WhatSellsTogetherData, SalesReportData } from "@/app/manager_trends/columns"
import ManagerNavBar from "@/components/ManagerNavBar";
import { getUserSession } from "@/lib/session";

export default async function ManagerTrendsPage() {
    const user_session = await getUserSession();
    const user = user_session ? await prisma.users.findUnique({
        where: {
            email: user_session?.email ?? undefined
        }
    }) : null;
    const salesReportData = await prisma.$queryRawUnsafe<SalesReportData[]>(`SELECT
            "Menu_Item".NAME AS MenuItem,
            COUNT("Order_Log".ID) AS NumberOfOrders,
            SUM("Order_Log".PRICE) AS TotalSales
        FROM
            "Order_Log"
        JOIN
            --string to array needs to change after transposition of order_menu.menu_item_id
            "Menu_Item" ON "Menu_Item".ID = ANY(STRING_TO_ARRAY("Order_Log"."menu_items", ',')::INTEGER[])
        WHERE
            "Order_Log".time BETWEEN '2024-01-01 00:00:00' AND '2024-01-31 23:59:59'
        GROUP BY
            "Menu_Item".NAME
        ORDER BY
            TotalSales DESC;`);
    const restockReportData = await prisma.$queryRawUnsafe<RestockReportData[]>(`SELECT * FROM "Ingredient" WHERE STOCK < 10000 ORDER BY STOCK;`);
    const whatSellsTogtherData = await prisma.$queryRawUnsafe<WhatSellsTogetherData[]>(`SELECT mi1.name AS item1_name, mi2.name AS item2_name, COUNT(*) AS frequency
        FROM (
            SELECT t1.item AS item1, t2.item AS item2
            FROM (
                SELECT id, UNNEST(STRING_TO_ARRAY(menu_items, ',')::INTEGER[]) AS item
                FROM "Order_Log"
                WHERE time >= '2023-12-01 00:00:00' AND time <= '2024-01-01 00:00:00'
            ) AS t1
            JOIN (
                SELECT id, UNNEST(STRING_TO_ARRAY(menu_items, ',')::INTEGER[]) AS item
                FROM "Order_Log"
                WHERE time >= '2023-12-01 00:00:00' AND time <= '2024-01-01 00:00:00'
            ) AS t2 ON t1.id = t2.id AND t1.item < t2.item
        ) AS menu_pairs
        JOIN "Menu_Item" AS mi1 ON menu_pairs.item1 = mi1.id
        JOIN "Menu_Item" AS mi2 ON menu_pairs.item2 = mi2.id
        GROUP BY item1_name, item2_name
        ORDER BY frequency DESC
        LIMIT 10;`);
    return (
        <>
        <ManagerNavBar username={user?.name}/>
        <ManagerTrends salesReportData = {salesReportData} restockReportData ={restockReportData} whatSellsTogtherData = {whatSellsTogtherData}/>
        </>
    );
}
