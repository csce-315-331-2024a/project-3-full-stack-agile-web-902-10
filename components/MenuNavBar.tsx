"use client";
import Link from "next/link";
import { signIn, signOut } from 'next-auth/react';
import * as React from "react";
import { useTheme } from "next-themes";

import { Button, buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

export default function MenuNavBar({ username, is_manager }: { username: string | undefined, is_manager: boolean | undefined }) {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    }

    return (
        <div className="border-b">
            <div className="flex h-16 items-center justify-center px-4">
                <nav className="flex item-center space-x-4 lg:space-x-48">
                    <Link 
                        href={is_manager === undefined ? "https://www.weather.gov/" : "/manager"}
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        {is_manager === undefined ? "68 F" : "Manager"}
                    </Link>
                    <p className="text-sm font-medium transition-colors">{username === undefined ? "Rev's Grill" : "Welcome, " + username.split(" ")[0]}</p>
                    <Dialog>
                        <DialogTrigger className="text-sm font-medium transition-colors hover:text-primary">Settings</DialogTrigger>
                        <DialogContent className="sm:max-w-[30em] md:max-w-[50em] md:max-h-[50em] rounded-[50px]">
                            <DialogHeader>
                                <DialogTitle>Settings</DialogTitle>
                                <DialogDescription>Make changes to your session here.</DialogDescription>
                            </DialogHeader>
                            <div className="flex-col space-y-4">
                                <div className="flex items-center gap-4">
                                    <Switch checked={theme == "dark" ? true : false} onCheckedChange={toggleTheme} id="dark-mode"/>
                                    <Label htmlFor="dark-mode">Dark Mode</Label>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Switch id="another-setting"/>
                                    <Label htmlFor="another-setting">another setting</Label>
                                </div>
                                <div className="flex items-center gap-4">
                                    {username === undefined ? 
                                        <Button variant={"outline"} onClick={() => signIn('google', { callbackUrl: "/menu" })}>Sign In</Button> :
                                        <Button variant={"destructive"} onClick={() => signOut()}>Sign Out</Button>
                                    }
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </nav>
            </div>
        </div>
    );
}