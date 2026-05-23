import s from "./Habits.module.scss";
import { Button, Empty, Flex, Spin, Typography, type MenuProps } from "antd";
import { useTranslations } from "next-intl";
import type { Habit } from "../model/types";
import { HabitCard } from "./HabitCard";
import { AddHabitCard } from "./AddHabitCard";

const { Text } = Typography;

type HabitListProps = {
  habits: Habit[];
  editMode: boolean;
  isLoaded: boolean;
  completedHabitIds: Set<string>;
  getMenuItems: (habit: Habit) => MenuProps["items"];
  getMenuClick: (habit: Habit) => MenuProps["onClick"];
  onAddHabit: () => void;
  onEditHabit: (habit: Habit) => void;
  onToggleCompletion: (habitId: string) => void;
};

export function HabitList({
  habits,
  editMode,
  isLoaded,
  completedHabitIds,
  getMenuItems,
  getMenuClick,
  onAddHabit,
  onEditHabit,
  onToggleCompletion,
}: HabitListProps) {
  const t = useTranslations("habits");

  if (!isLoaded) {
    return (
      <Flex flex={1} align="center" justify="center">
        <Spin size="large" />
      </Flex>
    );
  }

  if (!habits.length && !editMode) {
    return (
      <Flex flex={1} align="center" justify="center">
        <Empty
          description={
            <Flex vertical gap={4}>
              <Text>{t("empty.title")}</Text>
              <Text type="secondary">{t("empty.description")}</Text>
            </Flex>
          }
        >
          <Button type="primary" onClick={onAddHabit}>
            {t("actions.addHabit")}
          </Button>
        </Empty>
      </Flex>
    );
  }

  return (
    <div className={s["root__habit-grid"]}>
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          editMode={editMode}
          isCompleted={completedHabitIds.has(habit.id)}
          menuItems={getMenuItems(habit)}
          onMenuClick={getMenuClick(habit)}
          onEdit={onEditHabit}
          onToggleCompletion={onToggleCompletion}
        />
      ))}
      {editMode && <AddHabitCard onAddHabit={onAddHabit} />}
    </div>
  );
}
