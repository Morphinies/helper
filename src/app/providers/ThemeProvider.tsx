import themeConfig from "@/styles/themeConfig";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import "dayjs/locale/en";
import React, { useContext, useState } from "react";
import { useLocale } from "next-intl";
import { App, ConfigProvider, theme as antdTheme } from "antd";
import enUS from "antd/locale/en_US";
import ruRU from "antd/locale/ru_RU";

export type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined,
);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const antdLocale = locale === "ru" ? ruRU : enUS;

  dayjs.locale(locale);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ConfigProvider
        locale={antdLocale}
        theme={{
          ...themeConfig,
          algorithm:
            theme === "dark"
              ? antdTheme.darkAlgorithm
              : antdTheme.defaultAlgorithm,
        }}
      >
        <App
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </App>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
