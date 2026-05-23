import { Metadata } from "next";
import { Habits } from "@/widgets/Habits";
import { PageWrapper } from "@/widgets/PageWrapper";

export const metadata: Metadata = {
  title: "Habits | Helper",
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageWrapper locale={locale} messagesKey={"habits"}>
      <Habits />
    </PageWrapper>
  );
}
