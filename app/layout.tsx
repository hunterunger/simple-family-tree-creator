import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cx } from "@/utils/all";

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
            <body className={cx(inter.className, "h-screen")}>{children}</body>
        </html>
    );
}
