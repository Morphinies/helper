import { Tasks } from "@/widgets/Tasks";
import { PageWrapper } from "@/widgets/PageWrapper";
import { getPageMetadataMessages } from "@/i18n/messages";
import type { Metadata } from "next";

type TasksPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: TasksPageProps): Promise<Metadata> {
  const { locale } = await params;

  return getPageMetadataMessages(locale, "tasks");
}

export default async function TasksPage({ params }: TasksPageProps) {
  const { locale } = await params;

  return (
    <PageWrapper locale={locale} messagesKey="tasks">
      <Tasks />
    </PageWrapper>
  );
}
