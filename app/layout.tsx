import { Overpass_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

import { CartStoreProvider } from "@/lib/provider/cart-store-provider";

import "@/app/globals.css"

const overpass_mono = Overpass_Mono({
    subsets: ["latin"],
    display: "swap"
})

export default function HomeLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" className={overpass_mono.className}>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                >
                    <CartStoreProvider>
                        {children}
                    </CartStoreProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}