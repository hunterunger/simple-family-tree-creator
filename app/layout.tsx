import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cx } from "@/utils/all";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import "./globals.css";
import "@mantine/core/styles.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "Simple Family Tree Maker",
    description: "Create a family tree with a simple YAML syntax",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <ColorSchemeScript />
            </head>
            <body
                className={cx(
                    inter.className,
                    "h-screen bg-background-1 ",
                    inter.variable
                )}
            >
                <MantineProvider>
                    <Navbar />
                    <main className=" h-full">{children}</main>
                </MantineProvider>
            </body>
        </html>
    );
}
