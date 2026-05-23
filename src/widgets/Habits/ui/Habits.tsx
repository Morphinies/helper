"use client";

import s from "./Habits.module.scss";
import { HabitList } from "./HabitList";
import { HabitModal } from "./HabitModal";
import { DailyStats } from "./DailyStats";
import { HabitsTopbar } from "./HabitsTopbar";
import { DateNavigation } from "./DateNavigation";
import { Button, Flex } from "antd";
import { useHabitsView } from "../model/useHabitsView";

export const Habits = () => {
  const { topbar, dateNavigation, habitList, stats, finishEditing, modal } =
    useHabitsView();

  return (
    <Flex flex={1} vertical gap="large" className={s["root"]}>
      <HabitsTopbar {...topbar} />

      <DateNavigation {...dateNavigation} />

      <Flex flex={1} vertical gap="middle">
        <HabitList {...habitList} />

        <DailyStats {...stats} />

        {finishEditing.visible && (
          <Button
            className={s["root__finish-button"]}
            onClick={finishEditing.onClick}
          >
            Finish Editing
          </Button>
        )}
      </Flex>

      <HabitModal {...modal} />
    </Flex>
  );
};
