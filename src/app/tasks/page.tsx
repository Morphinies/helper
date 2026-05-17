import { Metadata } from "next";
import { Tasks } from "@/widgets/Tasks";
import { PageWrapper } from "@/widgets/PageWrapper";

export const metadata: Metadata = {
  title: "Tasks",
};

export default function TasksPage() {
  return (
    <PageWrapper>
      <Tasks />
    </PageWrapper>
  );
}
