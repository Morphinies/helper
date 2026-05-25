import { useTranslations } from "next-intl";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Radio, Typography } from "antd";
import type { TasksViewMode } from "../model/useTasksView";

const { Title } = Typography;

type TasksTopbarProps = {
  view: TasksViewMode;
  onViewChange: (value: TasksViewMode) => void;
  onAddTask: () => void;
};

const views: TasksViewMode[] = ["list", "board"];

export function TasksTopbar({
  view,
  onViewChange,
  onAddTask,
}: TasksTopbarProps) {
  const t = useTranslations("tasks");

  return (
    <Flex justify="space-between" align="center">
      <Title level={1}>{t("title")}</Title>
      <Flex align="center" gap="small" wrap>
        <Button
          title={t("actions.addTask")}
          icon={<PlusOutlined />}
          onClick={onAddTask}
        >
          {t("actions.add")}
        </Button>
        <Radio.Group
          value={view}
          onChange={(event) => onViewChange(event.target.value)}
        >
          {views.map((value) => (
            <Radio.Button key={value} value={value}>
              {t(`views.${value}`)}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Flex>
    </Flex>
  );
}
