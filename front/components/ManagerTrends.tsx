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
 
import { cn } from "@/lib/utils"

export default function ManagerTrends({ excessReportData, productUsageReportData, salesReportData, restockReportData, whatSellsTogtherData, user }: { excessReportData: ExcessReportData[], productUsageReportData: ProductUsageReportData[], salesReportData: SalesReportData[], restockReportData: RestockReportData[], whatSellsTogtherData: WhatSellsTogetherData[], user: Users | null }) {

    const [selectedTrend, setSelectedTrend] = useState<string | undefined>(undefined);

    const router = useRouter();
    const socket = useSocket();
    const [currentUser, setCurrentUser] = useState<Users | null>(user);

    const [beginDate, setBeginDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

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

    const onButtonClick = (trend: string) => {
        setSelectedTrend(trend);
    }

    const dateToString = (date: Date) => {
        return date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString() + "-" + date.getDate().toString()
    }

    return (
        <div className="hidden lg:flex flex-row">
            <ScrollArea className="h-[92vh] w-auto p-10  whitespace-nowrap">
                <div className="flex flex-col w-[10vw] space-y-8 justify-center items-center">
                    <h1 className="text-lg font-bold"> Trends </h1>
                    <Separator />
                    <Button variant="destructive" key={"Test3"} className="w-[8vw] h-[9vh] text-lg font-bold whitespace-normal" onClick={() => router.push("/manager")}> {"Back to Manager"} </Button>
                    <Button variant={(selectedTrend == "Product Usage Chart" ? "default" : "secondary")} key={"Test"} className="w-[8vw] h-[9vh] text-lg font-bold whitespace-normal" onClick={() => onButtonClick("Product Usage Chart")}> {"Product Usage Chart"} </Button>
                    <Button variant={(selectedTrend == "Sales Report" ? "default" : "secondary")} key={"Test"} className="w-[8vw] h-[9vh] text-lg font-bold whitespace-normal" onClick={() => onButtonClick("Sales Report")}> {"Sales Report"} </Button>
                    <Button variant={(selectedTrend == "Excess Report" ? "default" : "secondary")} key={"Test"} className="w-[8vw] h-[9vh] text-lg font-bold whitespace-normal" onClick={() => onButtonClick("Excess Report")}> {"Excess Report"} </Button>
                    <Button variant={(selectedTrend == "Restock Report" ? "default" : "secondary")} key={"Test"} className="w-[8vw] h-[9vh] text-lg font-bold whitespace-normal" onClick={() => onButtonClick("Restock Report")}> {"Restock Report"} </Button>
                    <Button variant={(selectedTrend == "What Sells Together" ? "default" : "secondary")} key={"Test2"} className="w-[8vw] h-[9vh] text-lg font-bold whitespace-normal" onClick={() => onButtonClick("What Sells Together")}> {"What Sells Together"} </Button>

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
                {selectedTrend == "Product Usage Chart" && (
                    <div>
                        <BarChart title={"Product Usage Chart"} label={"Quantity Used"} labels={productUsageReportData.map(a => a.ingredient)} data={productUsageReportData.map(b => Number(b.totalquantityused))} />
                    </div>
                )}
                {selectedTrend == "Sales Report" && (
                    <div>
                        <BarChart title={"Sales Report"} label={"Total Sales"} labels={salesReportData.map(a => a.menuitem)} data={salesReportData.map(b => Number(b.totalsales))} />
                    </div>
                )}
                {selectedTrend == "Excess Report" && (
                    <div>
                        <DataTable columns={ExcessReportColumns} data={excessReportData} />
                    </div>
                )}
                {selectedTrend == "Restock Report" && (
                    <div>
                        <DataTable columns={RestockReportColumns} data={restockReportData} />
                    </div>
                )}
                {selectedTrend == "What Sells Together" && (
                    <div>
                        <DataTable columns={WhatSellsTogetherColumns} data={whatSellsTogtherData} />
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