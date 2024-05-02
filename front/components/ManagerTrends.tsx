"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RestockReportData, RestockReportColumns, WhatSellsTogetherData, WhatSellsTogetherColumns, SalesReportData, ProductUsageReportData, ExcessReportColumns, ExcessReportData } from "@/app/manager_trends/columns"
import { DataTable } from "@/components/ui/data-table"
import { useRouter } from 'next/navigation';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import BarChart from "@/components/ui/bar-chart"
import { Roles, Users } from "@prisma/client";
import { useSocket } from "@/lib/socket";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "@radix-ui/react-icons"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"
import { useToast } from "@/components/ui/use-toast"
 
import { cn } from "@/lib/utils"

/**
 * Component for displaying manager trends.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {ExcessReportData[]} props.excessReportData - The excess report data.
 * @param {ProductUsageReportData[]} props.productUsageReportData - The product usage report data.
 * @param {SalesReportData[]} props.salesReportData - The sales report data.
 * @param {RestockReportData[]} props.restockReportDataInit - The restock report data.
 * @param {WhatSellsTogetherData[]} props.whatSellsTogetherData - The "what sells together" data.
 * @param {Users | null} props.user - The user data.
 * @returns {JSX.Element} The rendered component.
 */
export default function ManagerTrends({ excessReportData, productUsageReportData, salesReportData, restockReportDataInit, whatSellsTogetherData, user }: { excessReportData: ExcessReportData[], productUsageReportData: ProductUsageReportData[], salesReportData: SalesReportData[], restockReportDataInit: RestockReportData[], whatSellsTogetherData: WhatSellsTogetherData[], user: Users | null }) {

    const [selectedTrend, setSelectedTrend] = useState<string | undefined>(undefined);

    const router = useRouter();
    const socket = useSocket();
    const [currentUser, setCurrentUser] = useState<Users | null>(user);

    const [beginDate, setBeginDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    const [restockReport, setRestockReport] = useState<RestockReportData[]>(restockReportDataInit);
    const [whatSellsTogether, setWhatSellsTogether] = useState<WhatSellsTogetherData[]>(whatSellsTogetherData);
    const [salesReport, setSalesReport] = useState<SalesReportData[]>(salesReportData);
    const [productUsage, setProductUsage] = useState<ProductUsageReportData[]>(productUsageReportData);
    const [excessReport, setExcessReport] = useState<ExcessReportData[]>(excessReportData);

    console.log(excessReport)

    useEffect(() => {
        if (socket) {
            socket.emit("users:read", {}, (users: Users[]) => {
                setCurrentUser(users.find(u => u.id === user?.id) || null);
                if (currentUser?.role !== Roles.Admin && currentUser?.role !== Roles.Manager) {
                    router.push("/manager");
                }
            });
            socket.on("users", (users: Users[]) => {
                setCurrentUser(users.find(u => u.id === user?.id) || null);
                if (currentUser?.role !== Roles.Admin && currentUser?.role !== Roles.Manager) {
                    router.push("/manager");
                }
            });
        }
    }, [socket])

    const auth = {
        email: user?.email,
        jwt: user?.jwt
    };

    const { toast } = useToast();
    useEffect(() => {
        if (socket) {
            socket.emit("rawQuery", auth, salesReportString(), (data: SalesReportData[]) => {
                setSalesReport(data);
            });
        }
        if (socket) {
            socket.emit("rawQuery", auth, restockReportString(), (data: RestockReportData[]) => {
                setRestockReport(data);
            });
        }
        if (socket) {
            socket.emit("rawQuery", auth, productUsageChartString(), (data: ProductUsageReportData[]) => {
                setProductUsage(data);
            });
        }
        if (socket) {
            socket.emit("rawQuery", auth, excessReportString(), (data: ExcessReportData[]) => {
                setExcessReport(data);
            });
        }
        if (socket) {
            socket.emit("rawQuery", auth, whatSellsTogetherString(), (data: WhatSellsTogetherData[]) => {
                setWhatSellsTogether(data);
            });
        }
        if ((endDate ? endDate : new Date()) < (beginDate ? beginDate : new Date(1999, 1, 1))) {
            toast({
                title: "Inavlid Date",
                description: "Please make sure the end date isn't before the start date"
            });
        }
    }, [beginDate, endDate]);

    const onButtonClick = (trend: string) => {
        setSelectedTrend(trend);
    }

    const dateToString = (date: Date) => {
        return date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString() + "-" + date.getDate().toString()
    }

    function productUsageChartString() {
        return `SELECT
            "Ingredient".NAME AS Ingredient,
            SUM("Ingredients_Menu".QUANTITY) AS TotalQuantityUsed,
            "Ingredient".CATEGORY
        FROM
            "Order_Log"
        JOIN
            --string to array needs to change after transposition of order_menu.menu_item_id
            "Menu_Item" ON "Menu_Item".ID = ANY(STRING_TO_ARRAY("Order_Log"."menu_items", ',')::INTEGER[])
        JOIN
            "Ingredients_Menu" ON "Menu_Item".ID = "Ingredients_Menu".MENU_ID
        JOIN
            "Ingredient" ON "Ingredients_Menu".INGREDIENTS_ID = "Ingredient".ID
        WHERE
            "Order_Log".time BETWEEN '`+ dateToString(beginDate ? beginDate : new Date(1999, 1, 1)) + ` 00:00:00' AND '`+ dateToString(endDate ? endDate : new Date()) +` 23:59:59'
        GROUP BY
            "Ingredient".NAME, "Ingredient".CATEGORY
        ORDER BY
            TotalQuantityUsed DESC;`
    }

    function salesReportString() {
        return `SELECT
            "Menu_Item".NAME AS MenuItem,
            COUNT("Order_Log".ID) AS NumberOfOrders,
            SUM("Order_Log".PRICE) AS TotalSales
        FROM
            "Order_Log"
        JOIN
            --string to array needs to change after transposition of order_menu.menu_item_id
            "Menu_Item" ON "Menu_Item".ID = ANY(STRING_TO_ARRAY("Order_Log"."menu_items", ',')::INTEGER[])
        WHERE
            "Order_Log".time BETWEEN '`+ dateToString(beginDate ? beginDate : new Date(1999, 1, 1)) + ` 00:00:00' AND '`+ dateToString(endDate ? endDate : new Date()) +` 23:59:59'
        GROUP BY
            "Menu_Item".NAME
        ORDER BY
            TotalSales DESC;`
    }

    function excessReportString() {
        return `SELECT
        "Ingredient".NAME AS Ingredient,
        SUM("Ingredients_Menu".QUANTITY) AS TotalQuantityUsed,
        "Ingredient".CATEGORY
    FROM
        "Order_Log"
    JOIN
        --string to array needs to change after transposition of order_menu.menu_item_id
        "Menu_Item" ON "Menu_Item".ID = ANY(STRING_TO_ARRAY("Order_Log"."menu_items", ',')::INTEGER[])
    JOIN
        "Ingredients_Menu" ON "Menu_Item".ID = "Ingredients_Menu".MENU_ID
    JOIN
        "Ingredient" ON "Ingredients_Menu".INGREDIENTS_ID = "Ingredient".ID
    WHERE
        "Order_Log".time BETWEEN '`+ dateToString(beginDate ? beginDate : new Date(1999, 1, 1)) + ` 00:00:00' AND '`+ dateToString(new Date()) +` 23:59:59'
    GROUP BY
        "Ingredient".NAME, "Ingredient".CATEGORY, "Ingredient".STOCK
    HAVING
        SUM("Ingredients_Menu".QUANTITY) <  0.1* ("Ingredient".STOCK + SUM("Ingredients_Menu".QUANTITY))
    ORDER BY
        TotalQuantityUsed DESC;`
    }

    const restockReportString = () => {
        return `SELECT * FROM "Ingredient" WHERE is_active = True AND STOCK < MIN_STOCK ORDER BY STOCK;`;
    }

    function whatSellsTogetherString() {
        return `SELECT mi1.name AS item1_name, mi2.name AS item2_name, COUNT(*) AS frequency
        FROM (
            SELECT t1.item AS item1, t2.item AS item2
            FROM (
                SELECT id, UNNEST(STRING_TO_ARRAY(menu_items, ',')::INTEGER[]) AS item
                FROM "Order_Log"
                WHERE time >= '`+ dateToString(beginDate ? beginDate : new Date(1999, 1, 1)) + ` 00:00:00' AND time <= '`+ dateToString(endDate ? endDate : new Date()) +` 23:59:59'
            ) AS t1
            JOIN (
                SELECT id, UNNEST(STRING_TO_ARRAY(menu_items, ',')::INTEGER[]) AS item
                FROM "Order_Log"
                WHERE time >= '`+ dateToString(beginDate ? beginDate : new Date(1999, 1, 1)) + ` 00:00:00' AND time <= '`+ dateToString(endDate ? endDate : new Date()) +` 23:59:59'
            ) AS t2 ON t1.id = t2.id AND t1.item < t2.item
        ) AS menu_pairs
        JOIN "Menu_Item" AS mi1 ON menu_pairs.item1 = mi1.id
        JOIN "Menu_Item" AS mi2 ON menu_pairs.item2 = mi2.id
        GROUP BY item1_name, item2_name
        ORDER BY frequency DESC
        LIMIT 10;`
    }

    return (
        <div className="hidden lg:flex flex-row">
            <ScrollArea className="h-[92vh] w-auto p-10  whitespace-nowrap">
                <div className="flex flex-col w-[10vw] space-y-8 justify-center items-center">
                    <h1 className="text-lg font-bold"> Trends </h1>
                    <Separator />
                    <Button variant="destructive" key={"Test3"} className="w-[8vw] h-[9vh] text-lg font-bold whitespace-normal" onClick={() => router.push("/manager")}> {"Back to Manager"} </Button>
                    <Button variant={(selectedTrend == "Product Usage Chart" ? "default" : "secondary")} key={"PUC"} className="w-[8vw] h-[9vh] text-lg font-bold whitespace-normal" onClick={() => onButtonClick("Product Usage Chart")}> {"Product Usage Chart"} </Button>
                    <Button variant={(selectedTrend == "Sales Report" ? "default" : "secondary")} key={"SR"} className="w-[8vw] h-[9vh] text-lg font-bold whitespace-normal" onClick={() => onButtonClick("Sales Report")}> {"Sales Report"} </Button>
                    <Button variant={(selectedTrend == "Excess Report" ? "default" : "secondary")} key={"ER"} className="w-[8vw] h-[9vh] text-lg font-bold whitespace-normal" onClick={() => onButtonClick("Excess Report")}> {"Excess Report"} </Button>
                    <Button variant={(selectedTrend == "Restock Report" ? "default" : "secondary")} key={"RR"} className="w-[8vw] h-[9vh] text-lg font-bold whitespace-normal" onClick={() => onButtonClick("Restock Report")}> {"Restock Report"} </Button>
                    <Button variant={(selectedTrend == "What Sells Together" ? "default" : "secondary")} key={"WST"} className="w-[8vw] h-[9vh] text-lg font-bold whitespace-normal" onClick={() => onButtonClick("What Sells Together")}> {"What Sells Together"} </Button>

                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>
            <ScrollArea className="h-[92vh] w-[80vw] p-8 whitespace-nowrap">
                <HoverCard>
                    <HoverCardTrigger>
                        <Button variant="link">{selectedTrend}(ℹ️)</Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-200">
                        {selectedTrend == "Product Usage Chart" && (
                            <div>
                                The Product Usage Chart displays all ingredients based on the quantity used over a user defined time period.
                            </div>
                        )}
                        {selectedTrend == "Sales Report" && (
                            <div>
                                The Sales Report displays all menu items based on the total profit of each item made over a user defined time period.
                            </div>
                        )}
                        {selectedTrend == "Excess Report" && (
                            <div>
                                The Excess Report displays all ingredients that saw less than 10% use from a user defined time to the current time.
                            </div>
                        )}
                        {selectedTrend == "Restock Report" && (
                            <div>
                                The Restock Report displays all ingredients whose current stock is under the minimum stock treshold.
                            </div>
                        )}
                        {selectedTrend == "What Sells Together" && (
                            <div>
                                The What Sells Together Report displays pairs of items that are most popular sold together.
                            </div>
                        )}
                        {selectedTrend == undefined && (
                            <div>
                                Select a trend using the buttons to the left.
                            </div>
                        )}
                    </HoverCardContent>
                </HoverCard>
                {(selectedTrend != "Restock Report" && selectedTrend != undefined) && ( <div>
                From:
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !beginDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {beginDate? format(beginDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={beginDate}
                            onSelect={setBeginDate}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    </div>
                )}
                {(selectedTrend == "Product Usage Chart" || selectedTrend == "Sales Report" || selectedTrend == "What Sells Together") && ( <div>
                To:
                  <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                )}
                {selectedTrend == "Excess Report" && ( <div>
                To: Present Day
                </div>
                )}
                {selectedTrend == "Product Usage Chart" && (
                    <div>
                        <BarChart title={"Product Usage Chart"} label={"Quantity Used"} labels={productUsage.map(a => a.ingredient)} data={productUsage.map(b => Number(b.totalquantityused))} beginDate={beginDate ? beginDate : new Date(1999, 1, 1)} endDate={endDate ? endDate : new Date()} />
                    </div>
                )}
                {selectedTrend == "Sales Report" && (
                    <div>
                        <BarChart title={"Sales Report"} label={"Total Sales"} labels={salesReport.map( (rep) => rep.menuitem ) } data={salesReport.map( (b) => Number(b.totalsales)) } beginDate={beginDate ? beginDate : new Date(1999, 1, 1)} endDate={endDate ? endDate : new Date()} />
                    </div>
                )}
                {selectedTrend == "Excess Report" && (
                    <div>
                        <DataTable columns={ExcessReportColumns} data={excessReport} />
                    </div>
                )}
                {selectedTrend == "Restock Report" && (
                    <div>
                        <DataTable columns={RestockReportColumns} data={restockReport} />
                    </div>
                )}
                {selectedTrend == "What Sells Together" && (
                    <div>
                        <DataTable columns={WhatSellsTogetherColumns} data={whatSellsTogether} />
                    </div>
                )}
                {selectedTrend == undefined && (
                    <div>
                        <h1 className="text-lg font-bold"> Select a trend with the buttons to the left. </h1>
                    </div>
                )}
            </ScrollArea>
        </div>
    );


}