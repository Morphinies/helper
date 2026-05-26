import "server-only";

import { getServerSession } from "next-auth";
import { authOptions } from "./options";

import type { Session } from "next-auth";

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export type AuthUser = Session["user"];

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getAuthSession();

  return session?.user?.id ? session.user : null;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) throw new UnauthorizedError();

  return user;
}
