import "antd/dist/reset.css";
import "@/styles/globals.scss";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { fontsClass } from "@/styles/fonts";
import { Layout } from "@/widgets/Layout";

export const metadata: Metadata = {
  title: {
    template: "%s | Helper",
    default: "Helper",
  },
  description: "Your assistant in daily routine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontsClass}>
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
