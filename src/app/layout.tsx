import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import type { Viewport } from "next";

export const metadata: Metadata = {
  title: "Group Reading",
  description: "Group Reading",
  icons: { icon: "/vercel.svg" },
};

export const viewport: Viewport = { maximumScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`no-scrollbar overflow-x-clip antialiased`}>{children}</body>
    </html>
  );
}
