export type HabitRecurrence =
  | "daily"
  | "every_n_days"
  | "weekly"
  | "custom_weekdays";

export type Habit = {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  recurrence: HabitRecurrence;
  interval?: number;
  daysOfWeek?: number[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type HabitCompletion = {
  habitId: string;
  date: string;
  completed: boolean;
};

export type HabitFormValues = {
  title: string;
  description?: string;
  recurrence: HabitRecurrence;
  interval?: number;
  daysOfWeek?: number[];
  startDate: string;
};
