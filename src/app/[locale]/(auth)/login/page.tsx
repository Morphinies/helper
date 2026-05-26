import { Login } from "@/features/auth";
import { routing } from "@/i18n/routing";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/shared/lib/auth/session";
import type { Metadata } from "next";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  const user = await getCurrentUser();

  if (user) {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;

    redirect(`${prefix}/`);
  }

  return <Login />;
}
