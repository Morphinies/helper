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
  deadline?: string;
}

export type TaskFormValues = Pick<
  Task,
  "title" | "description" | "status" | "deadline"
>;
