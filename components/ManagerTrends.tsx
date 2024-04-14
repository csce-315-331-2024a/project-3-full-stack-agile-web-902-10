"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RestockReportData, RestockReportColumns, WhatSellsTogetherData, WhatSellsTogetherColumns } from "@/app/manager_trends/columns"
import { DataTable } from "@/components/ui/data-table"
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import BarChart from "@/components/ui/bar-chart"




export default function ManagerTrends({ restockReportData, whatSellsTogtherData }: {restockReportData: RestockReportData[], whatSellsTogtherData: WhatSellsTogetherData[]}) {

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
                {selectedTrend == "Sales Report" && (
                    <div>
                        <BarChart title={"Test"} label={"hello"} labels={["1", "2"]} data={[3.4, 12]}/>
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