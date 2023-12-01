import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cx } from "@/utils/all";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import "./globals.css";
import "@mantine/core/styles.css";

const inter = Inter({ subsets: ["latin"] });

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
            <body className={cx(inter.className, "h-screen")}>
                <MantineProvider>{children}</MantineProvider>
            </body>
        </html>
    );
}
