import { NextRequest, NextResponse } from "next/server";

const DOCS: Record<string, string> = {
  "privacy-policy":
    "http://5.77.39.26:1337/uploads/Politiki_Dorodokias_gia_site_ver_1_e3e6f7a6cb.pdf",
  "quality-policy":
    "http://5.77.39.26:1337/uploads/Politiki_Poiotitas_gia_site_ver3_1c0dec6f9e.pdf",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ doc: string }> }
) {
  const { doc } = await params;
  const url = DOCS[doc];
  if (!url) {
    return new NextResponse("Not found", { status: 404 });
  }

  const upstream = await fetch(url);
  if (!upstream.ok) {
    return new NextResponse("Document unavailable", { status: 502 });
  }

  const body = await upstream.arrayBuffer();
  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${doc}.pdf"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
