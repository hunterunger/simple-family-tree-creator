import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import { cx } from "@/utils/all";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Simple Family Tree Maker",
    description: "Create a family tree with a simple YAML syntax",
};
const theme = createTheme({
    /** Put your mantine theme override here */
});

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
                <MantineProvider theme={theme}>{children}</MantineProvider>
            </body>
        </html>
    );
}
