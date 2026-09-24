import { auth } from "@/auth";
import { db } from "@/lib/db";
import { seedDemoData } from "@/lib/seed";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  let pages = await db.page.findMany({
    where: { userId: session.user.id, isArchived: false },
    orderBy: { order: "asc" },
    include: {
      columns: {
        orderBy: { order: "asc" },
        include: {
          widgets: {
            orderBy: { order: "asc" },
            include: {
              bookmarks: {
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (pages.length === 0) {
    const demoPage = await seedDemoData(session.user.id);
    pages = [demoPage as any];
  }

  return NextResponse.json({ pages });
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const { title, icon, columnCount = 3 } = await req.json();

  const userPages = await db.page.findMany({ where: { userId: session.user.id } });

  const columnsData = Array.from({ length: columnCount }).map((_, idx) => ({
    order: idx,
    width: 1,
  }));

  const page = await db.page.create({
    data: {
      userId: session.user.id,
      title: title || "Neue Seite",
      icon: icon || "layout",
      order: userPages.length,
      columns: {
        create: columnsData,
      },
    },
    include: {
      columns: {
        include: {
          widgets: {
            include: {
              bookmarks: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ page });
}
