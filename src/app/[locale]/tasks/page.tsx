import { Metadata } from "next";
import { Tasks } from "@/widgets/Tasks";
import { PageWrapper } from "@/widgets/PageWrapper";

export const metadata: Metadata = {
  title: "Tasks",
};

export default async function TasksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageWrapper locale={locale} messagesKey="tasks">
      <Tasks />
    </PageWrapper>
  );
}
