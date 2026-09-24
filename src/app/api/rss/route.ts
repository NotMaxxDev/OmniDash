"use me";
// RSS Feed Proxy API Route
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const feedUrl = searchParams.get("url");

  if (!feedUrl) {
    return NextResponse.json({ error: "URL Parameter fehlt" }, { status: 400 });
  }

  try {
    const res = await fetch(feedUrl, {
      headers: {
        "User-Agent": "OmniDash-RSS-Fetcher/1.0",
      },
      next: { revalidate: 300 }, // 5 min server cache
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Feed Fehler HTTP ${res.status}` }, { status: res.status });
    }

    const xmlText = await res.text();
    return new NextResponse(xmlText, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "s-maxage=300, stale-while-revalidate",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Fehler beim Abrufen des Feeds" }, { status: 500 });
  }
}
