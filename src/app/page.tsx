import { Metadata } from "next";
import { Habits } from "@/widgets/Habits";
import { PageWrapper } from "@/widgets/PageWrapper";

export const metadata: Metadata = {
  title: "Habits | Helper",
};

export default function HomePage() {
  return (
    <PageWrapper>
      <Habits />
    </PageWrapper>
  );
}
