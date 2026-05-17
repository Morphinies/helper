import s from "./Habits.module.scss";
import { Button, Flex, Radio, Typography } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

const views = [
  { value: "day", label: "Day", disabled: false },
  { value: "week", label: "Week", disabled: true },
  { value: "month", label: "Month", disabled: true },
];

type HabitsTopbarProps = {
  view: string;
  editMode: boolean;
  onViewChange: (value: string) => void;
  onEditModeToggle: () => void;
  onAddHabit: () => void;
};

export function HabitsTopbar({
  view,
  editMode,
  onViewChange,
  onEditModeToggle,
  onAddHabit,
}: HabitsTopbarProps) {
  return (
    <Flex
      align="center"
      justify="space-between"
      gap="middle"
      className={s["root__topbar"]}
    >
      <Title level={1}>Habits</Title>
      <Flex align="center" gap="small" wrap>
        <Button
          type={editMode ? "primary" : "default"}
          icon={<EditOutlined />}
          onClick={onEditModeToggle}
        >
          Edit
        </Button>
        <Button
          aria-label="Add habit"
          title="Add habit"
          icon={<PlusOutlined />}
          onClick={onAddHabit}
        >
          Add
        </Button>
        <Radio.Group
          value={view}
          onChange={(event) => onViewChange(event.target.value)}
        >
          {views.map(({ value, label, disabled }) => (
            <Radio.Button key={value} value={value} disabled={disabled}>
              {label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Flex>
    </Flex>
  );
}
