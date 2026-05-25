"use client";

import type { ReactNode } from "react";
import { Layout as AntdLayout } from "antd";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AntdLayout>{children}</AntdLayout>;
}
