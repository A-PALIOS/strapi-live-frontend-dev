import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path");

  if (!path || !path.startsWith("/") || path.includes("..")) {
    return new NextResponse("Invalid path", { status: 400 });
  }

  const base = (process.env.STRAPI_API_URL ?? "").replace(/\/$/, "");

  if (!base) {
    return new NextResponse("STRAPI_API_URL not configured", { status: 500 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${base}${path}`, {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return new NextResponse(`Strapi returned ${res.status}`, { status: 404 });
    }

    const contentType = res.headers.get("content-type") ?? "image/jpeg";

    if (!contentType.startsWith("image/")) {
      return new NextResponse("Not an image", { status: 400 });
    }

    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      return new NextResponse("Strapi timeout", { status: 504 });
    }
    return new NextResponse("Failed to fetch image", { status: 502 });
  }
}
