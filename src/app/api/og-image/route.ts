import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path");

  if (!path || !path.startsWith("/uploads/")) {
    return new NextResponse("Invalid path", { status: 400 });
  }

  const base = (process.env.STRAPI_API_URL ?? "").replace(/\/$/, "");

  try {
    const res = await fetch(`${base}${path}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) return new NextResponse("Not found", { status: 404 });

    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }
}
