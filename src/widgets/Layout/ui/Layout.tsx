"use client";

import s from "./Layout.module.scss";
import { PropsWithChildren } from "react";
import { menuItems } from "../model/menu";
import { AuthButton } from "@/features/auth";
import { ThemeButton } from "@/shared/ui/ThemeButton";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Layout as AntdLayout, Flex, Menu, Select } from "antd";
import prepareMenuItems from "@/shared/utils/prepareMenuItems";

const { Header } = AntdLayout;

export const Layout = ({ children }: PropsWithChildren) => {
  const tMenu = useTranslations("menu");
  const tLocaleSwitcher = useTranslations("localeSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { items: preparedMenuItems, selectedKeys: selectedMenuKeys } =
    prepareMenuItems(menuItems, pathname, tMenu);

  return (
    <AntdLayout className={s["root"]}>
      <Header className={s["root__header"]}>
        <Menu
          theme="light"
          mode="horizontal"
          items={preparedMenuItems}
          className={s["root__menu"]}
          selectedKeys={selectedMenuKeys}
        />

        <Flex align="center" gap="small" className={s["root__tools"]}>
          <Select
            size="middle"
            value={locale}
            suffixIcon={null}
            title={tLocaleSwitcher("title")}
            aria-label={tLocaleSwitcher("title")}
            className={s["root__locale-select"]}
            classNames={{
              content: s["root__locale-select-content"],
              popup: {
                listItem: s["root__locale-select-option"],
              },
            }}
            options={[
              { value: "en", label: "en" },
              { value: "ru", label: "ru" },
            ]}
            onChange={(nextLocale) => {
              router.replace(pathname, { locale: nextLocale });
            }}
          />
          <ThemeButton className={s["root__theme-button"]} />
          <AuthButton />
        </Flex>
      </Header>
      {children}
      {/* <Footer className={s["root__footer"]}>{footerText}</Footer> */}
    </AntdLayout>
  );
};

export default Layout;
