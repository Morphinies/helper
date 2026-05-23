"use client";

import {
  Flex,
  Breadcrumb,
  Layout as AntdLayout,
  type BreadcrumbProps,
} from "antd";
import s from "./PageWrapper.module.scss";
import { PropsWithChildren } from "react";

const { Content } = AntdLayout;

export interface PageWrapperClientProps extends PropsWithChildren {
  breadcrumbs?: BreadcrumbProps["items"];
}

export const PageWrapperClient = ({
  children,
  breadcrumbs,
}: PageWrapperClientProps) => {
  return (
    <Content className={s["root"]}>
      {!!breadcrumbs?.length && (
        <Breadcrumb className={s["root__breadcrumb"]} items={breadcrumbs} />
      )}
      <Flex vertical className={s["root__content"]}>
        {children}
      </Flex>
    </Content>
  );
};

export default PageWrapperClient;
