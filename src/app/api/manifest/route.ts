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
    appleTouchStartupImage: [
      {
        url: "/splash/640x1136.png",
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/splash/750x1294.png",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/splash/1242x2148.png",
        media:
          "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      // {
      //   url: "/images/splash/launch-1125x2436.png",
      //   media:
      //     "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      // },
      // {
      //   url: "/images/splash/launch-1536x2048.png",
      //   media:
      //     "(min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)",
      // },
      // {
      //   url: "/images/splash/launch-1668x2224.png",
      //   media:
      //     "(min-device-width: 834px) and (max-device-width: 834px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)",
      // },
      // {
      //   url: "/images/splash/launch-2048x2732.png",
      //   media:
      //     "(min-device-width: 1024px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)",
      // },
    ],
  };

  return NextResponse.json(dynamicManifest, {
    headers: {
      "Content-Type": "application/manifest+json",
    },
  });
}
