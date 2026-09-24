import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ favicon: null }, { status: 400 });
  }

  try {
    const urlObj = new URL(targetUrl);
    const domain = urlObj.hostname;
    // Use Google Favicon Service as standard fast fallback
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    return NextResponse.json({ favicon: faviconUrl });
  } catch (e) {
    return NextResponse.json({ favicon: null });
  }
}
