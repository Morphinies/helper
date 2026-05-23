import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Radio, Typography } from "antd";
import type { TasksViewMode } from "../model/useTasksView";

const { Title } = Typography;

type TasksTopbarProps = {
  view: TasksViewMode;
  onViewChange: (value: TasksViewMode) => void;
  onAddTask: () => void;
};

const views: { value: TasksViewMode; label: string }[] = [
  { value: "list", label: "List" },
  { value: "board", label: "Columns" },
];

export function TasksTopbar({
  view,
  onViewChange,
  onAddTask,
}: TasksTopbarProps) {
  return (
    <Flex justify="space-between" align="center">
      <Title level={1}>Tasks</Title>
      <Flex align="center" gap="small" wrap>
        <Button title="Add task" icon={<PlusOutlined />} onClick={onAddTask}>
          Add
        </Button>
        <Radio.Group
          value={view}
          onChange={(event) => onViewChange(event.target.value)}
        >
          {views.map(({ value, label }) => (
            <Radio.Button key={value} value={value}>
              {label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Flex>
    </Flex>
  );
}
