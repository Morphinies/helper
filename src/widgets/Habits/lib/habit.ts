import type { Habit, HabitFormValues } from "../model/types";

export type Translate = (
  key: string,
  values?: Record<string, string | number>,
) => string;

export function getRecurrenceLabel(habit: Habit, t: Translate) {
  if (habit.recurrence === "daily") return t("recurrence.daily");
  if (habit.recurrence === "weekly") return t("recurrence.weekly");
  if (habit.recurrence === "custom_weekdays") {
    const labels = [
      t("weekdays.sun"),
      t("weekdays.mon"),
      t("weekdays.tue"),
      t("weekdays.wed"),
      t("weekdays.thu"),
      t("weekdays.fri"),
      t("weekdays.sat"),
    ];

    return habit.daysOfWeek?.length
      ? habit.daysOfWeek.map((day) => labels[day]).join(", ")
      : t("recurrence.custom_weekdays");
  }

  return t("recurrence.everyNDaysValue", { count: habit.interval || 1 });
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
