import s from "./Habits.module.scss";
import { Card, Dropdown, Flex, Typography, type MenuProps } from "antd";
import { useTranslations } from "next-intl";
import { CheckOutlined } from "@ant-design/icons";
import { getRecurrenceLabel, type Habit } from "@/entities/habit";

const { Text, Title } = Typography;

type HabitCardProps = {
  habit: Habit;
  editMode: boolean;
  isCompleted: boolean;
  menuItems: MenuProps["items"];
  onMenuClick: MenuProps["onClick"];
  onEdit: (habit: Habit) => void;
  onToggleCompletion: (habitId: string) => void;
};

export function HabitCard({
  habit,
  editMode,
  isCompleted,
  menuItems,
  onMenuClick,
  onEdit,
  onToggleCompletion,
}: HabitCardProps) {
  const t = useTranslations("habits");
  const handleAction = () => {
    if (editMode) {
      onEdit(habit);
      return;
    }

    onToggleCompletion(habit.id);
  };

  return (
    <Dropdown
      trigger={["contextMenu"]}
      menu={{
        items: menuItems,
        onClick: onMenuClick,
      }}
    >
      <Card
        hoverable
        role="button"
        tabIndex={0}
        className={`${s["root__habit-card"]} ${
          isCompleted ? s["root__habit-card_completed"] : ""
        }`}
        onClick={handleAction}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;

          event.preventDefault();
          handleAction();
        }}
      >
        <Flex align="flex-start" justify="space-between" gap="middle">
          <Flex vertical gap={4}>
            <Title level={4} className={s["root__habit-card-title"]}>
              {habit.title}
            </Title>
            {habit.description && (
              <Text type="secondary">{habit.description}</Text>
            )}
            <Text className={s["root__habit-card-recurrence"]}>
              {getRecurrenceLabel(habit, t)}
            </Text>
          </Flex>
          <span className={s["root__habit-card-status"]}>
            {isCompleted && <CheckOutlined />}
          </span>
        </Flex>
      </Card>
    </Dropdown>
  );
}
