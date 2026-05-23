import { useEffect, useMemo, useState } from "react";
import {
  readHabitCompletions,
  readHabits,
  writeHabitCompletions,
  writeHabits,
} from "./storage";
import type { Habit, HabitCompletion, HabitFormValues } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function daysBetween(startDate: string, selectedDate: string) {
  return Math.floor(
    (parseDate(selectedDate).getTime() - parseDate(startDate).getTime()) /
      DAY_MS,
  );
}

function getDefaultDaysOfWeek(startDate: string) {
  return [parseDate(startDate).getDay()];
}

function getDaysOfWeek(values: HabitFormValues) {
  if (values.recurrence === "weekly")
    return getDefaultDaysOfWeek(values.startDate);
  if (values.recurrence === "custom_weekdays") return values.daysOfWeek || [];

  return undefined;
}

function isHabitVisible(habit: Habit, selectedDate: string) {
  if (!habit.isActive || selectedDate < habit.startDate) return false;

  if (habit.recurrence === "daily") return true;

  if (habit.recurrence === "every_n_days") {
    const interval = habit.interval && habit.interval > 0 ? habit.interval : 1;

    return daysBetween(habit.startDate, selectedDate) % interval === 0;
  }

  const daysOfWeek =
    habit.recurrence === "custom_weekdays"
      ? habit.daysOfWeek || []
      : habit.daysOfWeek?.length
        ? habit.daysOfWeek
        : getDefaultDaysOfWeek(habit.startDate);

  return daysOfWeek.includes(parseDate(selectedDate).getDay());
}

function completionKey(completion: Pick<HabitCompletion, "habitId" | "date">) {
  return `${completion.habitId}:${completion.date}`;
}

export function useHabits(selectedDate: string) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setHabits(readHabits());
      setCompletions(readHabitCompletions());
      setIsLoaded(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    writeHabits(habits);
  }, [habits, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    writeHabitCompletions(completions);
  }, [completions, isLoaded]);

  const visibleHabits = useMemo(
    () => habits.filter((habit) => isHabitVisible(habit, selectedDate)),
    [habits, selectedDate],
  );

  const completedHabitIds = useMemo(() => {
    return new Set(
      completions
        .filter(
          (completion) =>
            completion.date === selectedDate && completion.completed,
        )
        .map((completion) => completion.habitId),
    );
  }, [completions, selectedDate]);

  const addHabit = (values: HabitFormValues) => {
    const now = new Date().toISOString();
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      title: values.title,
      description: values.description,
      startDate: values.startDate,
      recurrence: values.recurrence,
      interval:
        values.recurrence === "every_n_days" ? values.interval || 1 : undefined,
      daysOfWeek: getDaysOfWeek(values),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    setHabits((prev) => [...prev, newHabit]);
  };

  const updateHabit = (id: string, values: HabitFormValues) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              title: values.title,
              description: values.description,
              startDate: values.startDate,
              recurrence: values.recurrence,
              interval:
                values.recurrence === "every_n_days"
                  ? values.interval || 1
                  : undefined,
              daysOfWeek: getDaysOfWeek(values),
              updatedAt: new Date().toISOString(),
            }
          : habit,
      ),
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
    setCompletions((prev) =>
      prev.filter((completion) => completion.habitId !== id),
    );
  };

  const toggleCompletion = (habitId: string) => {
    const key = completionKey({ habitId, date: selectedDate });

    setCompletions((prev) => {
      const existing = prev.find(
        (completion) => completionKey(completion) === key,
      );

      if (!existing) {
        return [...prev, { habitId, date: selectedDate, completed: true }];
      }

      return prev.map((completion) =>
        completionKey(completion) === key
          ? { ...completion, completed: !completion.completed }
          : completion,
      );
    });
  };

  return {
    habits,
    visibleHabits,
    completedHabitIds,
    isLoaded,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
  };
}
