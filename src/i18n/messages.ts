import { hasLocale, type AbstractIntlMessages } from "next-intl";

import { routing } from "./routing";

const messageNamespaces = ["common", "habits", "tasks"] as const;

export type MessageNamespace = (typeof messageNamespaces)[number];

function getValidLocale(locale: string) {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

function isMessageNamespace(value: string): value is MessageNamespace {
  return messageNamespaces.includes(value as MessageNamespace);
}

export async function getMessages(
  locale: string,
  namespace?: MessageNamespace | MessageNamespace[],
): Promise<AbstractIntlMessages> {
  if (!namespace) return {};

  const validLocale = getValidLocale(locale);
  const namespaces = Array.isArray(namespace) ? namespace : [namespace];
  const messages = await Promise.all(
    namespaces.map((item) => getNamespaceMessages(validLocale, item)),
  );

  return Object.assign({}, ...messages);
}

export async function getPageMetadataMessages(
  locale: string,
  namespace: Exclude<MessageNamespace, "common">,
) {
  const validLocale = getValidLocale(locale);
  const messages = (
    await import(`../messages/${validLocale}/${namespace}.json`)
  ).default as {
    metadata?: {
      title?: string;
      description?: string;
    };
  };

  return messages.metadata ?? {};
}

async function getNamespaceMessages(
  locale: string,
  namespace: MessageNamespace,
): Promise<AbstractIntlMessages> {
  if (!isMessageNamespace(namespace)) return {};

  const messages = (await import(`../messages/${locale}/${namespace}.json`))
    .default as AbstractIntlMessages;

  return namespace === "common" ? messages : { [namespace]: messages };
}
