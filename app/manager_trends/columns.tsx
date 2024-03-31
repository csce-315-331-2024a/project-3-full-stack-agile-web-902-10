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
 
export const columns: ColumnDef<RestockReportData>[] = [
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