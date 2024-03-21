import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            dropShadow: {
                "normal": "0 3em 3em rgba(0, 0, 0, 1)",
                "highlight": "0 1em 1em rgba(0, 0, 0, 1)",
            },
            colors: {
                back: "#F7FFF7;",
                fore: "#343434;",
                high1: "#B10F2E;",
                high2: "#570000;",
                high3: "#280000;",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
