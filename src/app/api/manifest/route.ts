// app/api/manifest/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  // Get readingGroupId from cookies or URL search params

  const referer = (await headers()).get("referer");
  let readingGroupId: string | null = null;
  let urlPathname = "";

  if (referer) {
    const url = new URL(referer);
    urlPathname = url.pathname;
    const pathParts = url.pathname.split("/");
    if (pathParts.length >= 3 && pathParts[1] === "reading") {
      readingGroupId = pathParts[2];
    }
  }

  const dynamicManifest = {
    name: "Readu",
    short_name: "Readu",
    description:
      "Readu brings friends together through shared reading experiences. Annotate, discuss, and enjoy books as a group.",
    start_url: readingGroupId ? `/reading/${readingGroupId}` : urlPathname,
    scope: "/",
    display: "standalone",
    background_color: "var(--color-background)",
    theme_color: "var(--color-background)",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };

  return NextResponse.json(dynamicManifest, {
    headers: {
      "Content-Type": "application/manifest+json",
    },
  });
}
