"use client";

import { Login_Log, Roles, Users } from "@prisma/client";
import { useState, useEffect } from "react";
import { useSocket, LoginLogRead } from "@/lib/socket";

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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel
} from "@/components/ui/select"

export default function LoginLogDesktop() {
    const [loginLogs, setLoginLogs] = useState<Login_Log[]>([]);
    const [users, setUsers] = useState<Users[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>("");
    const [pageIndex, setPageIndex] = useState(0);

    const socket = useSocket();

    useEffect(() => {
        if (socket) {
            let loginLogRead: LoginLogRead;
            loginLogRead = {
                skip: pageIndex * 10,
                take: 10,
                orderBy: {
                    time: "desc",
                },
            };
            socket.emit("loginLog:read", {}, (obj: Login_Log[]) => {
                setLoginLogs(obj);
            });
            socket.on("loginLog", (obj: Login_Log[]) => {
                setLoginLogs(obj);
            });
            socket.emit("users:read", {}, (obj: Users[]) => {
                setUsers(obj);
            });
            socket.on("users", (obj: Users[]) => {
                setUsers(obj);
            });
        }
    }, [socket]);

    useEffect(() => {
        if (socket) {
            let loginLogRead: LoginLogRead;
            if (selectedUser === "") {
                loginLogRead = {
                    skip: pageIndex * 10,
                    take: 10,
                    orderBy: {
                        time: "desc",
                    },
                };
            } else {
                const user = users.find((user) => user.id === parseInt(selectedUser));
                loginLogRead = {
                    skip: pageIndex * 10,
                    take: 10,
                    where: {
                        user_id: parseInt(selectedUser),
                    },
                    orderBy: {
                        time: "desc",
                    },
                };
            }
            socket.emit("loginLog:read", loginLogRead, (obj: Login_Log[]) => {
                setLoginLogs(obj);
            });
        }
    }, [pageIndex, selectedUser]);

    function onPreviousPage() {
        console.log(pageIndex, "pageIndex");
        if (pageIndex == 0) {
            return;
        }
        setPageIndex(pageIndex - 1);
    }

    return (
        <Card className="px-16">
            <CardHeader>
                <Pagination className="select-none">
                    <PaginationContent>
                        <PaginationPrevious onClick={() => setPageIndex((pageIndex - 1) >= 0 ? (pageIndex - 1) : 0)} />
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationNext onClick={() => setPageIndex(pageIndex + 1)} />
                    </PaginationContent>
                </Pagination>
                <Select onValueChange={setSelectedUser} defaultValue="Users">
                    <SelectTrigger className="">
                        <SelectValue>{users.find((user) => user.id === parseInt(selectedUser))?.email ?? "Users"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent className="w-[16vw]">
                        <SelectGroup>
                            {users.map((user) => (
                                <SelectItem value={user.id.toString()} key={user.id} className="text-lg">
                                    {user.email}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User ID</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Time Stamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loginLogs.map((loginLog) => {
                            const user = users.find((user) => user.id === loginLog.user_id);
                            return (
                                <TableRow key={loginLog.id}>
                                    <TableCell>#{loginLog.user_id}</TableCell>
                                    <TableCell>{user ? user.role : ""}</TableCell>
                                    <TableCell>{user ? user.email : ""}</TableCell>
                                    <TableCell>{new Date(loginLog.time).toLocaleString()}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
    );
}
