import type { Metadata } from "next";
import { Overpass_Mono } from "next/font/google";

import "@/app/globals.css"

const overpass_mono = Overpass_Mono({
    subsets: ["latin"],
    display: "swap"
})

export const metadata: Metadata = {
    title: "Menu | Rev's Grill",
    description: "Menu for Rev's Grill",
};

export default function HomeLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" className={overpass_mono.className}>
            <body className="bg-back">
                {children}
            </body>
        </html>
    );
}
