"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AntdRegistry } from "@ant-design/nextjs-registry";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AntdRegistry>{children}</AntdRegistry>
    </QueryClientProvider>
  );
}
