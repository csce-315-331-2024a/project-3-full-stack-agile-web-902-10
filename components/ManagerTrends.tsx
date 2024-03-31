"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Payment, columns } from "@/app/manager_trends/columns"
import { DataTable } from "@/components/ui/data-table"

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
      {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
      },
      // ...
    ]
  }


export default async function ManagerTrends() {

    const data = await getData()

    return (
        <div className="hidden lg:flex flex-row">
            <ScrollArea className="h-[92vh] w-auto p-12  whitespace-nowrap">
                <div className="flex flex-col w-[10vw] space-y-8 justify-center items-center">
                    <h1 className="text-lg font-bold"> Trends </h1>
                    <Separator />
                        <Button key={"Test"} className="w-[10vw] h-[12vh] text-lg font-bold"> {} </Button>
                    
                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>
            <ScrollArea className="h-[92vh] w-[80vw] p-8 whitespace-nowrap">
                <DataTable columns={columns} data={data} />
            </ScrollArea>
        </div>
    );


}