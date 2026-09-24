import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  const { pageId, width = 1 } = await req.json();
  if (!pageId) return NextResponse.json({ error: "PageId erforderlich" }, { status: 400 });

  const existingColumns = await db.column.findMany({ where: { pageId } });

  const newColumn = await db.column.create({
    data: {
      pageId,
      order: existingColumns.length,
      width,
    },
    include: { widgets: true },
  });

  return NextResponse.json({ column: newColumn });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Column ID erforderlich" }, { status: 400 });

  await db.column.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
