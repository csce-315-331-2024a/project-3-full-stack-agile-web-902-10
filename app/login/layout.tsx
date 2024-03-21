import type { Metadata } from "next";
import { Overpass_Mono } from "next/font/google";

import "@/app/globals.css"

const overpass_mono = Overpass_Mono({
    subsets: ["latin"],
    display: "swap"
})

export const metadata: Metadata = {
    title: "Login | Rev's Grill",
    description: "Login to the Point of Sale system for Rev's Grill",
};

export default function HomeLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" className={overpass_mono.className}>
            <body>
                {children}
            </body>
        </html>
    );
}
