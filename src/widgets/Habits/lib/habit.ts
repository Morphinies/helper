import type { Habit, HabitFormValues } from "../model/types";

export function getRecurrenceLabel(habit: Habit) {
  if (habit.recurrence === "daily") return "Daily";
  if (habit.recurrence === "weekly") return "Weekly";
  if (habit.recurrence === "custom_weekdays") {
    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return habit.daysOfWeek?.length
      ? habit.daysOfWeek.map((day) => labels[day]).join(", ")
      : "Specific Days";
  }

  return `Every ${habit.interval || 1} days`;
}

export function getFormValues(habit: Habit): HabitFormValues {
  return {
    title: habit.title,
    description: habit.description,
    recurrence: habit.recurrence,
    interval: habit.interval,
    daysOfWeek: habit.daysOfWeek,
    startDate: habit.startDate,
  };
}
