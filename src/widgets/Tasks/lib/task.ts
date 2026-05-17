import type { Task, TaskFormValues, TaskStatus } from "../model/types";

export const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "Todo" },
  { value: "progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
  { value: "hold", label: "On Hold" },
  { value: "rejected", label: "Rejected" },
];

export const statusLabels = statusOptions.reduce<Record<TaskStatus, string>>(
  (acc, option) => {
    acc[option.value] = option.label;
    return acc;
  },
  {} as Record<TaskStatus, string>,
);

export function getTaskFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description,
    status: task.status,
    deadline: task.deadline,
  };
}

export function getEmptyTaskFormValues(): TaskFormValues {
  return {
    title: "",
    description: "",
    status: "todo",
    deadline: undefined,
  };
}
