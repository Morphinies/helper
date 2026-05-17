import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { TaskItem } from "./TaskItem";
import type { ComponentProps } from "react";

type SortableTaskItemProps = Omit<
  ComponentProps<typeof TaskItem>,
  "dragAttributes" | "dragListeners" | "style"
>;

export function SortableTaskItem(props: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.task.id });

  return (
    <TaskItem
      {...props}
      ref={setNodeRef}
      dragging={props.dragging || isDragging}
      dragAttributes={attributes}
      dragListeners={listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    />
  );
}
