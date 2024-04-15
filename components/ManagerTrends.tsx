"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RestockReportData, RestockReportColumns, WhatSellsTogetherData, WhatSellsTogetherColumns, SalesReportData, ProductUsageReportData } from "@/app/manager_trends/columns"
import { DataTable } from "@/components/ui/data-table"
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import BarChart from "@/components/ui/bar-chart"




export default function ManagerTrends({ productUsageReportData, salesReportData ,restockReportData, whatSellsTogtherData }: {productUsageReportData: ProductUsageReportData[], salesReportData: SalesReportData[], restockReportData: RestockReportData[], whatSellsTogtherData: WhatSellsTogetherData[]}) {

    const [selectedTrend, setSelectedTrend] = useState<string | undefined>(undefined);

    const router = useRouter();

    const onButtonClick = (trend: string) => {
        setSelectedTrend(trend);
    }

    return (
        <div className="hidden lg:flex flex-row">
            <ScrollArea className="h-[92vh] w-auto p-12  whitespace-nowrap">
                <div className="flex flex-col w-[14vw] space-y-8 justify-center items-center">
                    <h1 className="text-lg font-bold"> Trends </h1>
                    <Separator />
                        <Button key={"Test"} className="w-[14vw] h-[12vh] text-lg font-bold" onClick={() => onButtonClick("Product Usage Chart")}> {"Product Usage Chart"} </Button>
                        <Button key={"Test"} className="w-[14vw] h-[12vh] text-lg font-bold" onClick={() => onButtonClick("Sales Report")}> {"Sales Report"} </Button>
                        <Button key={"Test"} className="w-[14vw] h-[12vh] text-lg font-bold" onClick={() => onButtonClick("Restock Report")}> {"Restock Report"} </Button>
                        <Button key={"Test2"} className="w-[14vw] h-[12vh] text-lg font-bold" onClick={() => onButtonClick("What Sells Together")}> {"What Sells Together"} </Button>
                        <Button key={"Test3"} className="w-[14vw] h-[12vh] text-lg font-bold" onClick={() => router.push("/manager")}> {"Back to Manager"} </Button>
                    
                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>
            <ScrollArea className="h-[92vh] w-[80vw] p-8 whitespace-nowrap">
                <HoverCard>
                    <HoverCardTrigger>
                        <Button variant="link">{selectedTrend}</Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-200">
                        The Restock Report displays all items that are below the minimum stock requirement.
                    </HoverCardContent>
                </HoverCard>
                {selectedTrend == "Product Usage Chart" && (
                    <div>
                        <BarChart title={"Product Usage Chart"} label={"Quantity Used"} labels={productUsageReportData.map(a => a.ingredient)} data={productUsageReportData.map(b => Number(b.totalquantityused))}/>
                    </div>
                )}
                {selectedTrend == "Sales Report" && (
                    <div>
                        <BarChart title={"Sales Report"} label={"Total Sales"} labels={salesReportData.map(a => a.menuitem)} data={salesReportData.map(b => Number(b.totalsales))}/>
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
                        <h1 className="text-lg font-bold"> Select a trend with the buttons to the right!! </h1>
                    </div>
                )}
            </ScrollArea>
        </div>
    );


}