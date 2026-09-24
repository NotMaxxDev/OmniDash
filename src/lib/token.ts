import { db } from "@/lib/db";
import crypto from "crypto";

export async function getOrCreateAdminToken() {
  let adminUser = await db.user.findFirst({
    where: { role: "admin" },
  });

  if (!adminUser) {
    // Generate 10-character alphanumeric token (e.g. "x8k2m9p4q1")
    const generatedToken = crypto.randomBytes(5).toString("hex").slice(0, 10);

    adminUser = await db.user.create({
      data: {
        email: "admin@omnidash.local",
        name: "Admin",
        password: generatedToken,
        role: "admin",
      },
    });

    console.log("\n==================================================");
    console.log("🔑 OMNIDASH ADMIN TOKEN ERSTELLT!");
    console.log(`Dein Login-Token lautet: ${generatedToken}`);
    console.log("Nutze diesen Token zum Anmelden am Dashboard.");
    console.log("==================================================\n");
  }

  return adminUser.password;
}
