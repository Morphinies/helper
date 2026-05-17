"use client";

import s from "./Tasks.module.scss";
import { Flex } from "antd";
import { TaskList } from "./TaskList";
import { TaskModal } from "./TaskModal";
import { TasksTopbar } from "./TasksTopbar";
import { useTasksView } from "../model/useTasksView";

export const Tasks = () => {
  const { topbar, taskList, modal } = useTasksView();

  return (
    <Flex flex={1} vertical gap="medium" className={s["root"]}>
      <TasksTopbar {...topbar} />

      <Flex
        flex={1}
        vertical
        justify={
          !taskList.isLoaded || !taskList.tasks.length ? "center" : "flex-start"
        }
      >
        <TaskList {...taskList} />
      </Flex>

      <TaskModal {...modal} />
    </Flex>
  );
};
