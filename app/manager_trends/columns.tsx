"use client"
 
import { ColumnDef } from "@tanstack/react-table"
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RestockReportData = {
  id: number
  name: string
  category: string
  stock: number
  min_stock: number
}

export type SalesReportData = {
  menuitem: string
  numberoforders: number
  totalsales: number
}

export type WhatSellsTogetherData = {
    item1_name: string
    item2_name: string
    frequency: number
}

export type ProductUsageReportData = {
  ingredient: string
  totalquantityused: number
  category: string
}
 
export const RestockReportColumns: ColumnDef<RestockReportData>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "min_stock",
    header: "Minimum Stock",
  },
]

export const WhatSellsTogetherColumns: ColumnDef<WhatSellsTogetherData>[] = [
    {
      accessorKey: "item1_name",
      header: "Item 1",
    },
    {
      accessorKey: "item2_name",
      header: "Item 2",
    },
    {
      accessorKey: "frequency",
      header: "Frequency",
    },
  ]