"use client";

import { Order_Log, Menu_Item } from "@prisma/client";
import { useState, useEffect } from "react";
import { useSocket, OrderLogRead } from "@/lib/socket";

import Image from "next/image"
import { MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

/**
 * Renders the OrderHistoryDesktop component.
 * 
 * @returns The rendered OrderHistoryDesktop component.
 */
export default function OrderHistoryDesktop() {
    const [orders, setOrders] = useState<Order_Log[]>([]);
    const [menu_items, setMenuItems] = useState<Menu_Item[]>([]);
    const [pageIndex, setPageIndex] = useState(0);

    const socket = useSocket();

    useEffect(() => {
        if (socket) {
            const orderLogRead: OrderLogRead = {
                skip: pageIndex * 10,
                take: 10,
                orderBy: {
                    time: "desc",
                },
            };
            socket.emit("menuItem:read", {}, (new_menu_items: Menu_Item[]) => {
                setMenuItems(new_menu_items);
            });
            socket.on("menuItem", (new_menu_items: Menu_Item[]) => {
                setMenuItems(new_menu_items);
            });
            socket.emit("orderLog:read", orderLogRead, (new_orders: Order_Log[]) => {

                setOrders(new_orders);
            });
            socket.on("orderLog", (new_orders: Order_Log[]) => {
                setOrders(new_orders);
            });
        }
    }, [socket]);

    useEffect(() => {
        if (socket) {
            const orderLogRead: OrderLogRead = {
                skip: pageIndex * 10,
                take: 10,
                orderBy: {
                    time: "desc",
                },
            };
            socket.emit("orderLog:read", orderLogRead, (new_orders: Order_Log[]) => {
                setOrders(new_orders);
            });
        }
    }, [pageIndex]);

    function onPreviousPage() {
        if (pageIndex == 0) {
            return;
        }
        setPageIndex(pageIndex - 1);
    }

    function aggregateItems(itemIds: number[]) {
        return itemIds.reduce((acc: { [key: number]: number }, id) => {
            acc[id] = (acc[id] || 0) + 1;
            return acc;
        }, {});
    }

    function renderMenuItemQuantities(menuIds: number[]) {
        const counts = aggregateItems(menuIds);
        return Object.entries(counts).map(([id, count]) => {
            const item = menu_items.find(item => item.id === Number(id));
            return <div key={id}>{item ? `${item.name} x${count}` : `ID ${id} x${count}`}</div>;
        });
    }

    return (
        <div className="p-4">
            <Pagination className="select-none">
                <PaginationContent>
                    <PaginationPrevious onClick={() => setPageIndex((pageIndex - 1) >= 0 ? (pageIndex - 1) : 0)} />
                    <PaginationItem>
                        <PaginationLink>{pageIndex + 1}</PaginationLink>
                    </PaginationItem>
                    <PaginationNext onClick={() => setPageIndex(pageIndex + 1)} />
                </PaginationContent>
            </Pagination>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Menu Items</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>#{order.id}</TableCell>
                            <TableCell>{new Date(order.time).toLocaleString()}</TableCell>
                            <TableCell>${order.price}</TableCell>
                            <TableCell>
                                <div className="grid grid-cols-3">
                                    {renderMenuItemQuantities(order.menu_items.split(", ").map(Number))}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
