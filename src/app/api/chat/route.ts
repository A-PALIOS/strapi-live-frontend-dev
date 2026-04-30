import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import qs from "qs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "";

const BASE_SYSTEM_PROMPT =
  "You are the official Digital Assistant of CMT Prooptiki. " +
  "CMT Prooptiki is a consulting company specializing in the Health Sector. " +
  "Its core expertise includes healthcare consulting, health sector projects, medical services advisory, and related areas. " +
  "CMT Prooptiki also has an IT department that offers additional services such as automation, AI solutions, and web development, but these are secondary offerings and not the company's main identity. " +
  "Your only purpose is to answer questions about CMT Prooptiki — its consulting services, health sector expertise, team, projects, insights, events, and how to get in contact. " +
  "Rules you must strictly follow:\n" +
  "1. Only respond to questions directly related to CMT Prooptiki — its identity, services, health sector work, team, insights, or events.\n" +
  "2. If the user asks anything unrelated to CMT Prooptiki — such as general knowledge, cooking, sports, politics, other companies, medical advice, or any off-topic subject — politely decline and redirect them. Example: 'I'm here specifically to help you learn about CMT Prooptiki. For other topics I'm not able to assist — but feel free to ask me anything about our company and services!'\n" +
  "3. Answer based on the real website data provided below in context sections. Never invent facts. If a detail is not in the data, say so honestly and invite the user to contact the team via the Contact page.\n" +
  "4. Keep answers concise, professional, and friendly.\n" +
  "5. Always respond in the same language the user writes in (Greek or English).";

// ─── Text extraction from Strapi blocks ───────────────────────────────────────

function extractTextFromBlocks(blocks: any[]): string {
  const lines: string[] = [];

  for (const block of blocks) {
    const texts: string[] = [];

    // Single text fields common across block types
    if (block.heading)        texts.push(`Heading: ${block.heading}`);
    if (block.title)          texts.push(`Title: ${block.title}`);
    if (block.headline)       texts.push(`Headline: ${block.headline}`);
    if (block.subheader)      texts.push(block.subheader);
    if (block.content)        texts.push(block.content);
    if (block.text)           texts.push(block.text);
    if (block.description)    texts.push(block.description);
    if (block.headingPrimary) texts.push(block.headingPrimary);
    if (block.bodyPrimary)    texts.push(block.bodyPrimary);
    if (block.introText)      texts.push(block.introText);

    // Items arrays (accordion, expertise, beliefs, use-cases, etc.)
    if (Array.isArray(block.items)) {
      for (const item of block.items) {
        const label = item.title ?? item.label ?? item.text ?? "";
        const body  = item.description ?? item.blurb ?? item.content ?? item.body ?? "";
        if (label) texts.push(`  • ${label}${body ? `: ${body}` : ""}`);
      }
    }

    // Mission values
    if (Array.isArray(block.values)) {
      for (const v of block.values) {
        if (v.title) texts.push(`  • ${v.title}${v.body ? `: ${v.body}` : ""}`);
      }
    }

    // Process steps
    if (Array.isArray(block.steps)) {
      for (const s of block.steps) {
        if (s.title) texts.push(`  • ${s.number ? s.number + ". " : ""}${s.title}${s.description ? `: ${s.description}` : ""}`);
      }
    }

    // Team members
    if (Array.isArray(block.team_members)) {
      for (const m of block.team_members) {
        if (m.FullName) texts.push(`  • ${m.FullName}${m.JobTitle ? ` — ${m.JobTitle}` : ""}${m.Bio ? `: ${m.Bio}` : ""}`);
      }
    }

    if (texts.length > 0) lines.push(texts.join("\n"));
  }

  return lines.join("\n");
}

// ─── Page fetcher ─────────────────────────────────────────────────────────────

const TEXT_BLOCKS_POPULATE = {
  on: {
    "blocks.service-info":           true,
    "blocks.about-info":             true,
    "blocks.info-block":             true,
    "blocks.moving-text":            true,
    "blocks.about-us-statement":     true,
    "blocks.statement-section":      true,
    "blocks.two-column-text":        true,
    "blocks.leading-institution-block": true,
    "blocks.heading":                true,
    "blocks.paragraph":              true,
    "blocks.mission-section":        { populate: { values: true } },
    "blocks.what-believe":           { populate: { items: true } },
    "blocks.services-accordion-block": { populate: { items: true } },
    "blocks.accordion-about":        { populate: { items: true } },
    "blocks.vertical-accordion-block": { populate: { items: true } },
    "blocks.process-steps":          { populate: { steps: true } },
    "blocks.expertise-grid":         { populate: { items: true } },
    "blocks.company-highlights":     { populate: { items: true } },
    "blocks.use-cases-section":      { populate: { items: true } },
    "blocks.team-grid":              { populate: { team_members: true } },
    "blocks.what-sets-us-apart":     { populate: { rightList: true } },
    "blocks.milestones-block":       { populate: { milestones: true } },
  },
};

async function fetchPages(parentSlug: string, label: string): Promise<string> {
  try {
    const mainQuery = qs.stringify(
      {
        filters: { slug: { $eq: parentSlug }, parent: { $null: true } },
        fields: ["title", "slug"],
        populate: { blocks: TEXT_BLOCKS_POPULATE },
      },
      { encodeValuesOnly: true }
    );

    const subQuery = qs.stringify(
      {
        filters: { parent: { slug: { $eq: parentSlug } } },
        fields: ["title", "slug"],
        populate: { blocks: TEXT_BLOCKS_POPULATE },
      },
      { encodeValuesOnly: true }
    );

    const [mainRes, subRes] = await Promise.all([
      fetch(`${STRAPI_URL}/api/pages?${mainQuery}`, { next: { revalidate: 300 } }),
      fetch(`${STRAPI_URL}/api/pages?${subQuery}`,  { next: { revalidate: 300 } }),
    ]);

    const mainData = mainRes.ok ? await mainRes.json() : { data: [] };
    const subData  = subRes.ok  ? await subRes.json()  : { data: [] };

    const pages = [...(mainData.data ?? []), ...(subData.data ?? [])];
    if (pages.length === 0) return "";

    const sections = pages.map((page: any) => {
      const pageTitle  = page.title ?? page.slug ?? "Page";
      const blockTexts = extractTextFromBlocks(page.blocks ?? []);
      return `PAGE: ${pageTitle}\n${blockTexts}`;
    });

    return `\n\n${label}:\n` + sections.join("\n\n---\n");
  } catch {
    return "";
  }
}

// ─── Insights fetcher ─────────────────────────────────────────────────────────

async function fetchInsights(): Promise<string> {
  try {
    const query = qs.stringify(
      {
        sort: ["publishedAt:desc"],
        pagination: { pageSize: 10 },
        fields: ["title", "description", "slug", "author", "publishedAt"],
      },
      { encodeValuesOnly: true }
    );

    const res = await fetch(`${STRAPI_URL}/api/articles?${query}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return "";

    const json     = await res.json();
    const articles = json?.data ?? [];
    if (articles.length === 0) return "";

    const lines = articles.map((a: any) => {
      const title       = a.title ?? "Untitled";
      const description = a.description ? ` — ${a.description}` : "";
      const author      = a.author ? ` (Author: ${a.author})` : "";
      const date        = a.publishedAt ? ` [${new Date(a.publishedAt).toLocaleDateString("el-GR")}]` : "";
      return `• ${title}${description}${author}${date} → /insights/${a.slug}`;
    });

    return "\n\nLATEST INSIGHTS FROM THE WEBSITE:\n" + lines.join("\n");
  } catch {
    return "";
  }
}

// ─── Intent detection ─────────────────────────────────────────────────────────

const INSIGHTS_KEYWORDS = [
  "insight", "insights", "article", "articles", "blog", "news",
  "latest", "publications", "post", "posts", "read", "written",
  "νέα", "άρθρο", "άρθρα", "αναρτήσεις", "δημοσιεύσεις",
];

const SERVICES_KEYWORDS = [
  "service", "services", "offer", "offering", "what do you do",
  "what does cmt", "specialize", "specialization", "expertise", "consulting",
  "υπηρεσία", "υπηρεσίες", "προσφέρετε", "εξειδίκευση", "τι κάνετε",
];

const ABOUT_KEYWORDS = [
  "about", "who are you", "who is cmt", "company", "mission",
  "vision", "values", "history", "founded",
  "σχετικά", "ποιοι είστε", "εταιρεία",
  "αποστολή", "αξίες", "ιστορία",
];

const LEADERSHIP_KEYWORDS = [
  "team", "staff", "people", "leadership", "leader", "leaders",
  "who works", "employees", "member", "members", "person", "personnel",
  "director", "manager", "executive", "ceo", "president",
  "ομάδα", "άνθρωποι", "προσωπικό", "στέλεχος", "στελέχη",
  "διευθυντής", "διοίκηση", "ηγεσία", "συνεργάτες",
];

function lastUserText(messages: { role: string; content: string }[]): string {
  const msg = [...messages].reverse().find((m) => m.role === "user");
  return msg?.content.toLowerCase() ?? "";
}

function matches(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw));
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const text = lastUserText(messages);

    const needsInsights    = matches(text, INSIGHTS_KEYWORDS);
    const needsServices    = matches(text, SERVICES_KEYWORDS);
    const needsAbout       = matches(text, ABOUT_KEYWORDS);
    const needsLeadership  = matches(text, LEADERSHIP_KEYWORDS);

    // Fetch only what is needed, all in parallel
    const [insightsContext, servicesContext, aboutContext, leadershipContext] = await Promise.all([
      needsInsights   ? fetchInsights()                                                          : Promise.resolve(""),
      needsServices   ? fetchPages("services",               "CMT PROOPTIKI SERVICES")           : Promise.resolve(""),
      needsAbout      ? fetchPages("about-us",               "ABOUT CMT PROOPTIKI")              : Promise.resolve(""),
      needsLeadership ? fetchPages("our-leadership-people",  "CMT PROOPTIKI LEADERSHIP & PEOPLE"): Promise.resolve(""),
    ]);

    const systemPrompt = BASE_SYSTEM_PROMPT + insightsContext + servicesContext + aboutContext + leadershipContext;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    const reply =
      response.choices[0]?.message?.content ??
      "Sorry — I could not generate a response right now.";

    return NextResponse.json({ text: reply });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json({ error: "Failed to contact assistant" }, { status: 500 });
  }
}
