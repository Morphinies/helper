import s from "./Tasks.module.scss";
import { Empty, Spin, type MenuProps } from "antd";
import type { Task } from "../model/types";
import { TaskItem } from "./TaskItem";

type TaskListProps = {
  tasks: Task[];
  isLoaded: boolean;
  activeActionsTaskId: string | null;
  getMenuItems: (task: Task) => MenuProps["items"];
  getMenuClick: (task: Task) => MenuProps["onClick"];
  onTaskClick: (task: Task) => void;
  onTaskMouseEnter: (id: string) => void;
  onTaskMouseLeave: () => void;
  onToggleTaskDone: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
};

export function TaskList({
  tasks,
  isLoaded,
  activeActionsTaskId,
  getMenuItems,
  getMenuClick,
  onTaskClick,
  onTaskMouseEnter,
  onTaskMouseLeave,
  onToggleTaskDone,
  onEditTask,
  onDeleteTask,
}: TaskListProps) {
  if (!isLoaded) return <Spin size="large" />;

  if (!tasks.length) return <Empty description="No tasks yet" />;

  return (
    <ul className={s["root__list"]}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          actionsVisible={activeActionsTaskId === task.id}
          menuItems={getMenuItems(task)}
          onMenuClick={getMenuClick(task)}
          onClick={onTaskClick}
          onMouseEnter={onTaskMouseEnter}
          onMouseLeave={onTaskMouseLeave}
          onToggleDone={onToggleTaskDone}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
        />
      ))}
    </ul>
  );
}
