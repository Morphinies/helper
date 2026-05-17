import { Button } from "antd";
import { Component } from "@/shared/types";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useTheme } from "@/app/providers/ThemeProvider";

interface ThemeButtonProps extends Component {}

export const ThemeButton = ({ className }: ThemeButtonProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      title="Switch theme"
      className={`${className}`}
      onClick={() => toggleTheme()}
      icon={theme === "dark" ? <MoonOutlined /> : <SunOutlined />}
    />
  );
};
