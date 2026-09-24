import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { seedDemoData } from "@/lib/seed";
import crypto from "crypto";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin Token",
      credentials: {
        password: { label: "Token", type: "password" },
      },
      async authorize(credentials) {
        const providedToken = (credentials?.password as string)?.trim();

        if (!providedToken) return null;

        let adminUser = await db.user.findFirst({
          where: { role: "admin" },
        });

        // First Installation Setup
        if (!adminUser) {
          // If env has token use it, otherwise generate random 10-char token
          const tokenToUse = process.env.ADMIN_TOKEN || providedToken;

          adminUser = await db.user.create({
            data: {
              email: "admin@omnidash.local",
              name: "Admin",
              password: tokenToUse,
              role: "admin",
            },
          });
          await seedDemoData(adminUser.id);
          return {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.name,
          };
        }

        // Validate token against stored password or ADMIN_TOKEN env
        const envToken = process.env.ADMIN_TOKEN;
        const isValid = providedToken === adminUser.password || (envToken && providedToken === envToken);

        if (!isValid) return null;

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
