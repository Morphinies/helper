import VkProvider from "next-auth/providers/vk";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/shared/lib/db";
import type { NextAuthOptions } from "next-auth";

const localAuthLogin = process.env.LOCAL_AUTH_LOGIN || "admin";
const localAuthPassword = process.env.LOCAL_AUTH_PASSWORD || "admin";
const localAuthEmail = "local@example.com";
const localAuthName = "Local User";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;

      return token;
    },
    session({ session, token }) {
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
      }

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Local",
      credentials: {
        login: { label: "Login", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const localAuthEnabled =
          process.env.NODE_ENV === "development" ||
          !!process.env.LOCAL_AUTH_ENABLED;

        if (!localAuthEnabled) return null;
        if (credentials?.login !== localAuthLogin) return null;
        if (credentials?.password !== localAuthPassword) return null;

        const user = await prisma.user.upsert({
          where: { email: localAuthEmail },
          update: { name: localAuthName },
          create: {
            name: localAuthName,
            email: localAuthEmail,
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
    VkProvider({
      clientId: process.env.VK_ID || process.env.VK_CLIENT_ID || "",
      clientSecret: process.env.VK_SECRET || process.env.VK_CLIENT_SECRET || "",
    }),
  ],
};
