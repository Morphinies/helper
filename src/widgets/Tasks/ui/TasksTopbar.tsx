import { Button, Flex, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

type TasksTopbarProps = {
  onAddTask: () => void;
};

export function TasksTopbar({ onAddTask }: TasksTopbarProps) {
  return (
    <Flex justify="space-between" align="center">
      <Title level={1}>Tasks</Title>
      <Button title="Add task" icon={<PlusOutlined />} onClick={onAddTask}>
        Add
      </Button>
    </Flex>
  );
}
