import { db } from "@/lib/db";
import { seedDemoData } from "@/lib/seed";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email und Passwort sind erforderlich." }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Ein Konto mit dieser E-Mail existiert bereits." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        email,
        name: name || email.split("@")[0],
        password: hashedPassword,
      },
    });

    // Seed default page for new user
    await seedDemoData(user.id);

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Fehler bei der Registrierung." }, { status: 500 });
  }
}
