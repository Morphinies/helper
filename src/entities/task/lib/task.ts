import type { Task, TaskFormValues, TaskStatus } from "../model/types";

export type Translate = (key: string) => string;

export const statusValues: TaskStatus[] = [
  "todo",
  "progress",
  "review",
  "done",
  "hold",
  "rejected",
];

export function getStatusLabel(t: Translate, status: TaskStatus) {
  return t(`status.${status}`);
}

export function getStatusOptions(t: Translate) {
  return statusValues.map((value) => ({
    value,
    label: getStatusLabel(t, value),
  }));
}

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
