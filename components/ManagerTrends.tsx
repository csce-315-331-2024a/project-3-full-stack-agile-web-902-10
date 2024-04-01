"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RestockReportData, RestockReportColumns } from "@/app/manager_trends/columns"
import { DataTable } from "@/components/ui/data-table"
import { useState } from "react";



export default function ManagerTrends({ restockReportData, data2 }: {restockReportData: RestockReportData[], data2: RestockReportData[]}) {

    const [selectedTrend, setSelectedTrend] = useState<string | undefined>(undefined);

    const onButtonClick = (trend: string) => {
        setSelectedTrend(trend);
    }

    const dataType = () => {
        if (selectedTrend == "Restock Report") {
            return restockReportData;
        }
        else if (selectedTrend == "What Sells Together") {
            return data2;
        } 
        return restockReportData;
    }

    const columnType = () => {
        if (selectedTrend == "Restock Report") {
            return RestockReportColumns;
        }
        else if (selectedTrend == "What Sells Together") {
            return RestockReportColumns;
        }
        return RestockReportColumns;
    }

    return (
        <div className="hidden lg:flex flex-row">
            <ScrollArea className="h-[92vh] w-auto p-12  whitespace-nowrap">
                <div className="flex flex-col w-[10vw] space-y-8 justify-center items-center">
                    <h1 className="text-lg font-bold"> Trends </h1>
                    <Separator />
                        <Button key={"Test"} className="w-[10vw] h-[12vh] text-lg font-bold" onClick={() => onButtonClick("Restock Report")}> {"Restock Report"} </Button>
                        <Button key={"Test2"} className="w-[10vw] h-[12vh] text-lg font-bold" onClick={() => onButtonClick("What Sells Together")}> {"What Sells Together"} </Button>
                        <Button key={"Test3"} className="w-[10vw] h-[12vh] text-lg font-bold" onClick={() => onButtonClick("Restock Report 3")}> {} </Button>
                    
                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>
            <ScrollArea className="h-[92vh] w-[80vw] p-8 whitespace-nowrap">
                <h1 className="text-lg font-bold"> {selectedTrend} </h1>
                <DataTable columns={columnType()} data={dataType()} />
            </ScrollArea>
        </div>
    );


}