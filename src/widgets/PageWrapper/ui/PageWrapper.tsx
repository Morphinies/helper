import { PropsWithChildren } from "react";
import { type BreadcrumbProps } from "antd";
import PageWrapperClient from "./PageWrapperClient";
import { getMessages, MessageNamespace } from "@/i18n/messages";
import { IntlMessagesProvider } from "@/app/providers/IntlMessagesProvider";
import { routing } from "@/i18n/routing";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/shared/lib/auth/session";

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
  const user = await getCurrentUser();

  if (!user) {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;

    redirect(`${prefix}/login`);
  }

  const messages = await getMessages(locale, messagesKey);

  return (
    <IntlMessagesProvider messages={messages}>
      <PageWrapperClient {...props} />
    </IntlMessagesProvider>
  );
};

export default PageWrapper;
