import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { html, json, opml } = await req.json();
  const bookmarks: { title: string; url: string; category?: string }[] = [];

  if (html) {
    // Basic regex parser for Chrome/Firefox HTML bookmark exports
    const linkRegex = /<A\s+[^>]*HREF="([^"]+)"[^>]*>(.*?)<\/A>/gi;
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      bookmarks.push({
        url: match[1],
        title: match[2].replace(/<[^>]+>/g, "").trim() || match[1],
      });
    }
  } else if (json) {
    try {
      const data = typeof json === "string" ? JSON.parse(json) : json;
      if (Array.isArray(data)) {
        data.forEach((item: any) => {
          if (item.url) bookmarks.push({ url: item.url, title: item.title || item.url });
        });
      }
    } catch (e) {}
  }

  return NextResponse.json({ success: true, count: bookmarks.length, bookmarks });
}
