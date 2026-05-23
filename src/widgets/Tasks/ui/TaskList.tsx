import s from "./Tasks.module.scss";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Empty, Spin, type MenuProps } from "antd";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Task } from "../model/types";
import { SortableTaskItem } from "./SortableTaskItem";
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
  onMoveTask: (taskId: string, overTaskId: string) => void;
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
  onMoveTask,
}: TaskListProps) {
  const t = useTranslations("tasks");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overlayWidth, setOverlayWidth] = useState<number | undefined>();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 260,
        tolerance: 6,
      },
    }),
  );

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveTask(tasks.find((task) => task.id === active.id) || null);
    setOverlayWidth(active.rect.current.initial?.width);
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null);
    setOverlayWidth(undefined);

    if (!over || active.id === over.id) return;

    onMoveTask(String(active.id), String(over.id));
  };

  if (!isLoaded) return <Spin size="large" />;

  if (!tasks.length) return <Empty description={t("empty")} />;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => {
        setActiveTask(null);
        setOverlayWidth(undefined);
      }}
    >
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className={s["root__list"]}>
          {tasks.map((task) => (
            <SortableTaskItem
              key={task.id}
              task={task}
              actionsVisible={
                activeActionsTaskId === task.id && activeTask?.id !== task.id
              }
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
      </SortableContext>
      <DragOverlay>
        {activeTask && (
          <TaskItem
            task={activeTask}
            actionsVisible={false}
            menuItems={getMenuItems(activeTask)}
            onMenuClick={getMenuClick(activeTask)}
            onClick={() => undefined}
            onMouseEnter={() => undefined}
            onMouseLeave={() => undefined}
            onToggleDone={onToggleTaskDone}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            dragging
            style={{ width: overlayWidth }}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
