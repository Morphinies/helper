import { Layout } from "@/widgets/Layout";
import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>;
}
