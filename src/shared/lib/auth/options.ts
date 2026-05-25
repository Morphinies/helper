import VkProvider from "next-auth/providers/vk";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

const localAuthLogin = process.env.LOCAL_AUTH_LOGIN || "admin";
const localAuthPassword = process.env.LOCAL_AUTH_PASSWORD || "admin";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Local",
      credentials: {
        login: { label: "Login", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials) {
        const localAuthEnabled =
          process.env.NODE_ENV === "development" ||
          !!process.env.LOCAL_AUTH_ENABLED;

        if (!localAuthEnabled) return null;
        if (credentials?.login !== localAuthLogin) return null;
        if (credentials?.password !== localAuthPassword) return null;

        return {
          id: "local-user",
          name: "Local User",
          email: "local@example.com",
        };
      },
    }),
    VkProvider({
      clientId: process.env.VK_ID || process.env.VK_CLIENT_ID || "",
      clientSecret: process.env.VK_SECRET || process.env.VK_CLIENT_SECRET || "",
    }),
  ],
};
