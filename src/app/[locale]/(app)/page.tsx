import { Habits } from "@/widgets/Habits";
import { PageWrapper } from "@/widgets/PageWrapper";
import { getPageMetadataMessages } from "@/i18n/messages";
import type { Metadata } from "next";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;

  return getPageMetadataMessages(locale, "habits");
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <PageWrapper locale={locale} messagesKey="habits">
      <Habits />
    </PageWrapper>
  );
}
