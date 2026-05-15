"use client";

import s from "./Layout.module.scss";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { Layout as AntdLayout, Menu } from "antd";
import prepareMenuItems from "@/shared/utils/prepareMenuItems";
import { menuItems } from "../model/menu";

const { Header } = AntdLayout;

export const Layout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const { items: preparedMenuItems, selectedKeys: selectedMenuKeys } =
    prepareMenuItems(menuItems, pathname);

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
      </Header>
      {children}
      {/* <Footer className={s["root__footer"]}>{footerText}</Footer> */}
    </AntdLayout>
  );
};

export default Layout;
