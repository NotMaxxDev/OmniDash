import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const { columnId, type, title, config } = await req.json();

  if (!columnId || !type) {
    return NextResponse.json({ error: "Fehlende Parameter" }, { status: 400 });
  }

  const column = await db.column.findUnique({
    where: { id: columnId },
    include: { widgets: true },
  });

  if (!column) {
    return NextResponse.json({ error: "Spalte nicht gefunden" }, { status: 404 });
  }

  const widget = await db.widget.create({
    data: {
      columnId,
      type,
      title: title || "Neues Widget",
      config: JSON.stringify(config || {}),
      order: column.widgets.length,
    },
    include: {
      bookmarks: true,
    },
  });

  return NextResponse.json({ widget });
}

export async function PUT(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const { widgetId, columnId, order, title, config, collapsed, color } = await req.json();

  if (!widgetId) {
    return NextResponse.json({ error: "Widget ID erforderlich" }, { status: 400 });
  }

  const updatedWidget = await db.widget.update({
    where: { id: widgetId },
    data: {
      ...(columnId && { columnId }),
      ...(order !== undefined && { order }),
      ...(title !== undefined && { title }),
      ...(config !== undefined && { config: JSON.stringify(config) }),
      ...(collapsed !== undefined && { collapsed }),
      ...(color !== undefined && { color }),
    },
    include: {
      bookmarks: true,
    },
  });

  return NextResponse.json({ widget: updatedWidget });
}

export async function DELETE(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Widget ID erforderlich" }, { status: 400 });
  }

  await db.widget.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
