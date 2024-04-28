"use client";
import Link from "next/link";
import { signIn, signOut } from 'next-auth/react';
import { useTheme } from "next-themes";
import { Users } from "@prisma/client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { useLanguageStore } from "@/lib/provider/language-store-provider";
import { useEffect, useState } from "react";
import { useSocket } from "@/lib/socket";


export default function CheckoutNavBar({ user }: { user: Users | null }) {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    }

    const language = useLanguageStore((state) => state.language);
    let [translated, setTranslated] = useState({
        back: "Back to Menu",
        settings: "Settings",
        make_changes: "Make changes to your session here.",
        dark_mode: "Dark Mode",
        another_setting: "another setting",
        sign_in: "Sign In",
        sign_out: "Sign Out"
    });

    const socket = useSocket();
    useEffect(() => {
        if (socket) {
            if (language !== "en") {
                socket.emit("translateJSON", translated, language, (new_translated: typeof translated) => {
                    setTranslated(new_translated);
                });
            }
        }
    }, [socket, language]);


    return (
        <div className="border-b">
            <div className="flex h-[8vh] items-center justify-center px-4">
                <nav className="flex w-full item-center justify-center md:mx-12">
                    <div className="flex justify-start border-2 rounded-sm">
                        <Link
                            href="/menu"
                            className="px-2 py-1 text-lg font-bold transition-colors hover:text-primary"
                        >
                            {translated.back}
                        </Link>
                    </div>
                    <div className="flex justify-center flex-grow">
                        <p className="text-lg font-bold text-center flex flex-col justify-center">{user?.name === undefined ? "Rev's Grill" : "Welcome, " + user.name.split(" ")[0]}</p>
                    </div>
                    <div className="flex justify-end border-2 rounded-sm">
                        <Dialog>
                            <DialogTrigger className="px-2 py-1 text-lg font-bold transition-colors hover:text-primary">{translated.settings}</DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{translated.settings}</DialogTitle>
                                    <DialogDescription>{translated.make_changes}</DialogDescription>
                                </DialogHeader>
                                <div className="flex-col space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Switch checked={theme === "dark" ? true : false} onCheckedChange={toggleTheme} id="dark-mode" />
                                        <Label htmlFor="dark-mode">{translated.dark_mode}</Label>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {user?.name === undefined ?
                                            <Button variant={"outline"} onClick={() => signIn('google', { callbackUrl: "/menu" })}>{translated.sign_in}</Button> :
                                            <Button variant={"destructive"} onClick={() => signOut()}>{translated.sign_out}</Button>
                                        }
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </nav>
            </div>
        </div>
    );
}
