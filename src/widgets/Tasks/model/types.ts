export type TaskStatus =
  | "todo"
  | "progress"
  | "review"
  | "done"
  | "hold"
  | "rejected";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
}

export type TaskCreate = Pick<Task, "title" | "description">;
