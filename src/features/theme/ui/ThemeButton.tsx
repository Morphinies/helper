import { Button } from "antd";
import { Component } from "@/shared/types";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useTranslations } from "next-intl";

type ThemeButtonProps = Component;

export const ThemeButton = ({ className }: ThemeButtonProps) => {
  const t = useTranslations("themeButton");
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      title={t("title")}
      className={`${className}`}
      onClick={() => toggleTheme()}
      icon={theme === "dark" ? <MoonOutlined /> : <SunOutlined />}
    />
  );
};
