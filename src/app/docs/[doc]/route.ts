import { NextRequest, NextResponse } from "next/server";

// STRAPI_DOCS_URL on the server; locally .env only has STRAPI_API_URL (the
// same Strapi), so fall back to it rather than answering 500 in dev.
const DOCS_BASE_URL = process.env.STRAPI_DOCS_URL ?? process.env.STRAPI_API_URL;

// Every public PDF, by the name it is served under. Each one answers at
//   /docs/<key>              (the footer's policy links use these)
//   /<key>.pdf               (root links, via the rewrite in next.config.ts)
// Value: the file's link from Strapi -> Media Library -> the PDF -> copy link.
// Only what is listed here is reachable; any other name is a 404.
// Keep keys in Latin letters / digits / - _ (Greeklish is fine), since the
// key is what appears in the URL.
const DOCS: Record<string, string> = {
  "privacy-policy": `${DOCS_BASE_URL}/uploads/Politiki_Dorodokias_gia_site_ver_1_e3e6f7a6cb.pdf`,
  "quality-policy": `${DOCS_BASE_URL}/uploads/Politiki_Poiotitas_gia_site_ver3_1c0dec6f9e.pdf`,

  // -> https://cmtprooptiki.gr/Onoma_Arxeiou.pdf
  //    Uncomment and replace the /uploads/... part with the link from Strapi.
  "5th_Forum_Review_and_Conclusions_EN": `${DOCS_BASE_URL}/uploads/5th_Forum_Review_and_Conclusions_EN_29e8d677dd.pdf
`,
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ doc: string }> }
) {
  if (!DOCS_BASE_URL) {
    return new NextResponse("Server misconfigured", { status: 500 });
  }

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

  // Plain filename= must be ASCII (a Greek character there makes the header
  // invalid and the response fails); filename* carries the real name for
  // browsers that read it, which is all current ones.
  const filename = `${doc}.pdf`;
  const asciiName = filename.replace(/[^\x20-\x7E]|"/g, "_");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
