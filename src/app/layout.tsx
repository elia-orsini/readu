import type { Metadata } from "next";
import "./globals.css";
import type { Viewport } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Readu",
  description: "Readu",
  icons: { icon: "/vercel.svg" },
  openGraph: {
    title: "Readu",
    description: "Readu",
    siteName: "Readu",
    images: [
      {
        url: "/cover-img.png",
        width: 700,
        height: 700,
        alt: "Readu",
      },
    ],
  },
};

export const viewport: Viewport = { maximumScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`no-scrollbar overflow-x-clip antialiased`}>
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-[var(--background)]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/">
                <div className="flex flex-row items-center">
                  <Image
                    src="/readu-sm-logo.png"
                    alt="Readu Logo"
                    width={200}
                    height={200}
                    className="ml-2 h-4 w-8"
                  />
                  <span className="ml-2 text-xl font-semibold text-[var(--foreground)]">
                    Readu{" "}
                  </span>
                  <p className="ml-2 mt-0.5 inline rounded bg-[var(--foreground)] px-2 text-sm text-[var(--background)]">
                    BETA
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
