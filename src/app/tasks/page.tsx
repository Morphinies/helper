import { Button } from "antd";
import { Metadata } from "next";
import { PageWrapper } from "@/widgets/PageWrapper";

export const metadata: Metadata = {
  title: "Helper - Tasks",
};

export default function Tasks() {
  return (
    <PageWrapper>
      <Button type="primary">Tasks</Button>
    </PageWrapper>
  );
}
