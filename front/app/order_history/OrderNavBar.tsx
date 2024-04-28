"use client";

import Link from "next/link";
import { signIn, signOut } from 'next-auth/react';
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Users } from "@prisma/client";


export default function OrderNavBar({ user }: { user: Users | null }) {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    }


    return (
        <div className="border-b pt-4">
            <div className="flex h-[6vh] items-center justify-center px-4">
                <nav className="flex w-full item-center justify-center md:mx-12">
                    <div className="flex justify-start">
                        <Link
                            href={"/menu"}
                            className="text-lg font-bold transition-colors hover:text-primary"
                        >
                            {"Back to menu"}
                        </Link>
                    </div>
                    <div className="flex justify-center flex-grow">
                        <p className="text-xl font-bold text-center">{"Orders: " + user?.name.split(" ")[0]}</p>
                    </div>
                    <div className="flex justify-end gap-x-16">
                        <Dialog>
                            <DialogTrigger className="text-lg font-bold transition-colors hover:text-primary">{"Settings"}</DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{"Settings"}</DialogTitle>
                                    <DialogDescription>{"Make changes to your session here"}</DialogDescription>
                                </DialogHeader>
                                <div className="flex-col space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Switch checked={theme === "dark" ? true : false} onCheckedChange={toggleTheme} id="dark-mode" />
                                        <Label htmlFor="dark-mode">{"Dark Mode"}</Label>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Switch id="another-setting" />
                                        <Label htmlFor="another-setting">{"another setting"}</Label>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {user?.name === undefined ?
                                            <Button variant={"outline"} onClick={() => signIn('google', { callbackUrl: "/menu" })}>{"Sign in"}</Button> :
                                            <Button variant={"destructive"} onClick={() => signOut()}>{"Sign out"}</Button>
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
