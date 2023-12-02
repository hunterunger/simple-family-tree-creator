import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                "primary-1": "#E63946",
                "primary-2": "#457B9D",
                "primary-3": "#A8DADC",
                "primary-4": "#1D3557",

                "background-1": "#F1FAEE",
            },
            fontFamily: {
                inter: "--font-inter",
            },
        },
    },
    plugins: [],
};
export default config;
