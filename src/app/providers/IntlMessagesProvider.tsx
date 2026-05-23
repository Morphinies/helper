"use client";

import {
  useLocale,
  useMessages,
  NextIntlClientProvider,
  type AbstractIntlMessages,
} from "next-intl";
import type { ReactNode } from "react";

type IntlMessagesProviderProps = {
  children: ReactNode;
  messages: AbstractIntlMessages;
};

export function IntlMessagesProvider({
  children,
  messages,
}: IntlMessagesProviderProps) {
  const locale = useLocale();
  const parentMessages = useMessages();

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={{
        ...parentMessages,
        ...messages,
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
}
