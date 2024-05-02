"use client";

import { Overpass_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

import { CartStoreProvider } from "@/lib/provider/cart-store-provider";
import { LanguageStoreProvider } from "@/lib/provider/language-store-provider";
import { Toaster } from "@/components/ui/toaster";

import "@/app/globals.css"

const overpass_mono = Overpass_Mono({
    subsets: ["latin"],
    display: "swap"
})

/**
 * HomeLayout component.
 * 
 * @param children - The children of the component.
 * @returns The HomeLayout component.
 */
export default function HomeLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" className={overpass_mono.className}>
            <body>
                <Toaster />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                >
                    <CartStoreProvider>
                        <LanguageStoreProvider>
                            {children}
                        </LanguageStoreProvider>
                    </CartStoreProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
