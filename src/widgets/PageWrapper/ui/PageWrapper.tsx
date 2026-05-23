import { PropsWithChildren } from "react";
import { type BreadcrumbProps } from "antd";
import PageWrapperClient from "./PageWrapperClient";
import { getMessages, MessageNamespace } from "@/i18n/messages";
import { IntlMessagesProvider } from "@/app/providers/IntlMessagesProvider";

export interface PageWrapperProps extends PropsWithChildren {
  locale: string;
  breadcrumbs?: BreadcrumbProps["items"];
  messagesKey?: MessageNamespace | MessageNamespace[];
}

export const PageWrapper = async ({
  locale,
  messagesKey,
  ...props
}: PageWrapperProps) => {
  const messages = await getMessages(locale, messagesKey);

  return (
    <IntlMessagesProvider messages={messages}>
      <PageWrapperClient {...props} />
    </IntlMessagesProvider>
  );
};

export default PageWrapper;
