import s from "./Tasks.module.scss";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Flex, Spin, Typography, type MenuProps } from "antd";
import { useRef, useState, type PropsWithChildren } from "react";
import type { Task, TaskStatus } from "../model/types";
import { statusLabels, statusOptions } from "../lib/task";
import { SortableTaskItem } from "./SortableTaskItem";
import { TaskItem } from "./TaskItem";

const { Text } = Typography;

const COLUMN_PREFIX = "column:";

type TaskBoardProps = {
  tasks: Task[];
  isLoaded: boolean;
  getMenuItems: (task: Task) => MenuProps["items"];
  getMenuClick: (task: Task) => MenuProps["onClick"];
  onTaskClick: (task: Task) => void;
  onToggleTaskDone: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onMoveTask: (taskId: string, status: TaskStatus, index: number) => void;
};

type BoardColumnProps = PropsWithChildren<{
  status: TaskStatus;
  count: number;
}>;

function getColumnId(status: TaskStatus) {
  return `${COLUMN_PREFIX}${status}`;
}

function getStatusFromColumnId(id: UniqueIdentifier) {
  const value = String(id);

  return value.startsWith(COLUMN_PREFIX)
    ? (value.slice(COLUMN_PREFIX.length) as TaskStatus)
    : null;
}

function BoardColumn({ status, count, children }: BoardColumnProps) {
  const { setNodeRef } = useDroppable({
    id: getColumnId(status),
  });

  return (
    <section ref={setNodeRef} className={s["root__column"]}>
      <Flex justify="space-between" align="center">
        <Text strong>{statusLabels[status]}</Text>
        <Text type="secondary">{count}</Text>
      </Flex>
      {children}
    </section>
  );
}

function sortTasks(tasks: Task[]) {
  return [...tasks].sort((a, b) => a.order - b.order);
}

function moveTaskPreview(
  tasks: Task[],
  taskId: string,
  status: TaskStatus,
  index: number,
) {
  const movingTask = tasks.find((task) => task.id === taskId);
  if (!movingTask) return tasks;

  const nextTasks = tasks.filter((task) => task.id !== taskId);
  const targetTasks = sortTasks(nextTasks.filter((task) => task.status === status));
  const normalizedIndex = Math.max(0, Math.min(index, targetTasks.length));
  const prev = targetTasks[normalizedIndex - 1];
  const next = targetTasks[normalizedIndex];
  const previewOrder =
    prev && next
      ? (prev.order + next.order) / 2
      : prev
        ? prev.order + 1000
        : next
          ? next.order / 2
          : 1000;

  return sortTasks([
    ...nextTasks,
    {
      ...movingTask,
      status,
      order: previewOrder,
    },
  ]);
}

export function TaskBoard({
  tasks,
  isLoaded,
  getMenuItems,
  getMenuClick,
  onTaskClick,
  onToggleTaskDone,
  onEditTask,
  onDeleteTask,
  onMoveTask,
}: TaskBoardProps) {
  const [previewTasks, setPreviewTasks] = useState(tasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overlayWidth, setOverlayWidth] = useState<number | undefined>();
  const lastPreviewKeyRef = useRef<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const visibleTasks = activeTask ? previewTasks : tasks;

  const getTasksByStatus = (status: TaskStatus) =>
    sortTasks(visibleTasks.filter((task) => task.status === status));

  const getMoveTarget = (activeId: UniqueIdentifier, overId: UniqueIdentifier) => {
    const overColumnStatus = getStatusFromColumnId(overId);
    if (overColumnStatus) {
      return {
        status: overColumnStatus,
        index: getTasksByStatus(overColumnStatus).filter(
          (task) => task.id !== activeId,
        ).length,
      };
    }

    const overTask = visibleTasks.find((task) => task.id === overId);
    if (!overTask) return null;

    const targetTasks = getTasksByStatus(overTask.status).filter(
      (task) => task.id !== activeId,
    );
    const overIndex = targetTasks.findIndex((task) => task.id === overTask.id);

    return {
      status: overTask.status,
      index: overIndex === -1 ? targetTasks.length : overIndex,
    };
  };

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveTask(tasks.find((task) => task.id === active.id) || null);
    setOverlayWidth(active.rect.current.initial?.width);
    lastPreviewKeyRef.current = null;
    setPreviewTasks(tasks);
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const target = getMoveTarget(active.id, over.id);
    if (!target) return;

    const activePreviewTask = previewTasks.find((task) => task.id === active.id);
    if (activePreviewTask?.status === target.status) return;

    const previewKey = `${active.id}:${target.status}`;
    if (lastPreviewKeyRef.current === previewKey) return;

    lastPreviewKeyRef.current = previewKey;
    setPreviewTasks((currentTasks) =>
      moveTaskPreview(
        currentTasks,
        String(active.id),
        target.status,
        currentTasks.filter(
          (task) => task.status === target.status && task.id !== active.id,
        ).length,
      ),
    );
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    const target = over ? getMoveTarget(active.id, over.id) : null;

    setActiveTask(null);
    setOverlayWidth(undefined);
    lastPreviewKeyRef.current = null;

    if (!target) {
      setPreviewTasks(tasks);
      return;
    }

    onMoveTask(String(active.id), target.status, target.index);
  };

  const onDragCancel = () => {
    setActiveTask(null);
    setOverlayWidth(undefined);
    lastPreviewKeyRef.current = null;
    setPreviewTasks(tasks);
  };

  if (!isLoaded) return <Spin size="large" />;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div className={s["root__board"]}>
        {statusOptions.map(({ value: status }) => {
          const statusTasks = getTasksByStatus(status);

          return (
            <BoardColumn key={status} status={status} count={statusTasks.length}>
              <SortableContext
                items={statusTasks.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className={s["root__column-list"]}>
                  {statusTasks.map((task) => (
                    <SortableTaskItem
                      key={task.id}
                      task={task}
                      variant="board"
                      actionsVisible={false}
                      menuItems={getMenuItems(task)}
                      onMenuClick={getMenuClick(task)}
                      onClick={onTaskClick}
                      onMouseEnter={() => undefined}
                      onMouseLeave={() => undefined}
                      onToggleDone={onToggleTaskDone}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                </ul>
              </SortableContext>
            </BoardColumn>
          );
        })}
      </div>
      <DragOverlay>
        {activeTask && (
          <TaskItem
            task={activeTask}
            variant="board"
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
