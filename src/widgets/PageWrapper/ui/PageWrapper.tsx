"use client";

import s from "./PageWrapper.module.scss";
import { PropsWithChildren } from "react";
import { Breadcrumb, Layout as AntdLayout, type BreadcrumbProps } from "antd";

const { Content } = AntdLayout;

export interface PageWrapperProps extends PropsWithChildren {
  breadcrumbs?: BreadcrumbProps["items"];
}

export const PageWrapper = ({ children, breadcrumbs }: PageWrapperProps) => {
  return (
    <Content className={s["root"]}>
      {!!breadcrumbs?.length && (
        <Breadcrumb className={s["root__breadcrumb"]} items={breadcrumbs} />
      )}
      <div className={s["root__content"]}>{children}</div>
    </Content>
  );
};

export default PageWrapper;
