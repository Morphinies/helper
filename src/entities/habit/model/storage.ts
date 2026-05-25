import type { Habit, HabitCompletion } from "./types";

const LS_HABITS = "habits";
const LS_HABIT_COMPLETIONS = "habit_completions";

function isHabit(value: unknown): value is Habit {
  if (!value || typeof value !== "object") return false;

  const habit = value as Partial<Habit>;

  return (
    typeof habit.id === "string" &&
    typeof habit.title === "string" &&
    (habit.description === undefined ||
      typeof habit.description === "string") &&
    typeof habit.startDate === "string" &&
    (habit.recurrence === "daily" ||
      habit.recurrence === "every_n_days" ||
      habit.recurrence === "weekly" ||
      habit.recurrence === "custom_weekdays") &&
    (habit.interval === undefined || typeof habit.interval === "number") &&
    (habit.daysOfWeek === undefined ||
      (Array.isArray(habit.daysOfWeek) &&
        habit.daysOfWeek.every((day) => typeof day === "number"))) &&
    typeof habit.isActive === "boolean" &&
    typeof habit.createdAt === "string" &&
    typeof habit.updatedAt === "string"
  );
}

function isHabitCompletion(value: unknown): value is HabitCompletion {
  if (!value || typeof value !== "object") return false;

  const completion = value as Partial<HabitCompletion>;

  return (
    typeof completion.habitId === "string" &&
    typeof completion.date === "string" &&
    typeof completion.completed === "boolean"
  );
}

function readList<T>(key: string, guard: (value: unknown) => value is T): T[] {
  if (typeof window === "undefined") return [];

  const value = window.localStorage.getItem(key);

  if (!value) return [];

  try {
    const parsedValue: unknown = JSON.parse(value);

    return Array.isArray(parsedValue) ? parsedValue.filter(guard) : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, values: T[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(key, JSON.stringify(values));
}

export function readHabits() {
  return readList(LS_HABITS, isHabit);
}

export function writeHabits(habits: Habit[]) {
  writeList(LS_HABITS, habits);
}

export function readHabitCompletions() {
  return readList(LS_HABIT_COMPLETIONS, isHabitCompletion);
}

export function writeHabitCompletions(completions: HabitCompletion[]) {
  writeList(LS_HABIT_COMPLETIONS, completions);
}
