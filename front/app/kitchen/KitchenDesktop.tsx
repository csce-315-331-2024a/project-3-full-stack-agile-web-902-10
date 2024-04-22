"use client";

import { Order_Log } from "@prisma/client";
import { useState, useEffect } from "react";
import { useSocket } from "@/lib/socket";


export default function KitchenDesktop({orders_init} : {orders_init : Order_Log[]}) {
    const [orders, setOrders] = useState<Order_Log[]>(orders_init);
    const socket = useSocket();

    useEffect(() => {
        if (socket) {
            socket.emit("orderLog:read", undefined, (new_orders: Order_Log[]) => {
                setOrders(new_orders);
            });
            socket.on("orderLog", (new_orders: Order_Log[]) => {
                setOrders(new_orders);
            });
        }
    }, [socket]);

    // show orders in a table
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Table Number</th>
                        <th>Order Time</th>
                        <th>Order Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => {
                        return (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.menu_items}</td>
                                <td>{order.ingredients}</td>
                                <td>{order.price}</td>
                                <td>{order.time.toUTCString()}</td>
                                <td>
                                    <button>View</button>
                                    <button>Complete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
