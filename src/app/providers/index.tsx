"use client";

import { Provider } from "react-redux";
import { ThemeProvider } from "./ThemeProvider";
import { queryClient, store } from "@/shared/lib/store";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AntdRegistry>
          <ThemeProvider>{children}</ThemeProvider>
        </AntdRegistry>
      </QueryClientProvider>
    </Provider>
  );
}
