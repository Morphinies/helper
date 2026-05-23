import "antd/dist/reset.css";
import "@/styles/globals.scss";
import { routing } from "@/i18n/routing";
import { Providers } from "../providers";
import { Layout } from "@/widgets/Layout";
import { notFound } from "next/navigation";
import { fontsClass } from "@/styles/fonts";
import { setRequestLocale } from "next-intl/server";
import { hasLocale, NextIntlClientProvider } from "next-intl";

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | Helper",
    default: "Helper",
  },
  description: "Your assistant in daily routine",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <html lang={locale} className={fontsClass}>
      <body>
        <NextIntlClientProvider>
          <Providers>
            <Layout>{children}</Layout>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
