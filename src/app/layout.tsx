import type { Metadata } from "next";
import "./globals.css";
import type { Viewport } from "next";

export const metadata: Metadata = {
  title: "Readu",
  description:
    "Readu brings friends together through shared reading experiences. Annotate, discuss, and enjoy books as a group.",
  icons: { icon: "/icon-192x192.png" },
  openGraph: {
    title: "Readu",
    description: "Readu brings friends together through shared reading experiences. Annotate, discuss, and enjoy books as a group.",
    siteName: "Readu",
    images: [
      {
        url: "/cover-img.png",
        width: 700,
        height: 700,
        alt: "Readu",
      },
    ],
    url: "https://readu-group-reading.vercel.app",
  },
  manifest: "/api/manifest",
};

export const viewport: Viewport = {
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="no-scrollbar overflow-x-clip antialiased">{children}</body>
    </html>
  );
}
