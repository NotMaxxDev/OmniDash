import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { seedDemoData } from "@/lib/seed";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  trustHost: true, // Fix UntrustedHost error in Docker/Reverse Proxy
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin Passkey",
      credentials: {
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
        const providedPassword = credentials?.password as string;

        if (!providedPassword || providedPassword !== adminPassword) {
          return null;
        }

        // Find or create single admin user
        let adminUser = await db.user.findFirst({
          where: { role: "admin" },
        });

        if (!adminUser) {
          const hashedPassword = await bcrypt.hash(adminPassword, 10);
          adminUser = await db.user.create({
            data: {
              email: "admin@omnidash.local",
              name: "Administrator",
              password: hashedPassword,
              role: "admin",
            },
          });
          await seedDemoData(adminUser.id);
        }

        return {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});
