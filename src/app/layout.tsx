import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import type { Viewport } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Group Reading",
  description: "Group Reading",
  icons: { icon: "/vercel.svg" },
};

export const viewport: Viewport = { maximumScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`no-scrollbar overflow-x-clip antialiased`}>
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex flex-row items-center">
                <span className="text-xl font-semibold text-gray-900">Readu </span>
                <p className="ml-2 mt-0.5 inline rounded bg-gray-700 px-2 text-sm text-white">
                  BETA
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/upload"
                  className="rounded-md bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800"
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
