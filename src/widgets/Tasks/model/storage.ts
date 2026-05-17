import type { Task } from "./types";

const LS_TASKS = "tasks";

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== "object") return false;

  const task = value as Partial<Task>;

  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    (task.description === undefined || typeof task.description === "string") &&
    (task.deadline === undefined || typeof task.deadline === "string") &&
    typeof task.status === "string" &&
    (task.order === undefined || typeof task.order === "number")
  );
}

export function readTasks(): Task[] {
  if (typeof window === "undefined") return [];

  const value = window.localStorage.getItem(LS_TASKS);

  if (!value) return [];

  try {
    const parsedValue: unknown = JSON.parse(value);

    return Array.isArray(parsedValue)
      ? parsedValue.filter(isTask).map((task, index) => ({
          ...task,
          order: task.order ?? (index + 1) * 1000,
        }))
      : [];
  } catch {
    return [];
  }
}

export function writeTasks(tasks: Task[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(LS_TASKS, JSON.stringify(tasks));
}
