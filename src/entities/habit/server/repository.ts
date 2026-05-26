import "server-only";

import { prisma } from "@/shared/lib/db";
import type { Habit, HabitCompletion, HabitFormValues } from "../model/types";
import type { HabitRecurrence as PrismaHabitRecurrence } from "@/generated/prisma/enums";

const DAY_MS = 24 * 60 * 60 * 1000;

function toDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function toDateString(value: Date) {
  return value.toISOString().slice(0, 10);
}

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

  return [];
}

function getInterval(values: HabitFormValues) {
  if (values.recurrence !== "every_n_days") return null;

  return values.interval && values.interval > 0 ? values.interval : 1;
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

function toHabit(habit: {
  id: string;
  title: string;
  description: string | null;
  startDate: Date;
  recurrence: PrismaHabitRecurrence;
  interval: number | null;
  daysOfWeek: number[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): Habit {
  return {
    id: habit.id,
    title: habit.title,
    description: habit.description ?? undefined,
    startDate: toDateString(habit.startDate),
    recurrence: habit.recurrence,
    interval: habit.interval ?? undefined,
    daysOfWeek: habit.daysOfWeek.length ? habit.daysOfWeek : undefined,
    isActive: habit.isActive,
    createdAt: habit.createdAt.toISOString(),
    updatedAt: habit.updatedAt.toISOString(),
  };
}

function toHabitCompletion(completion: {
  habitId: string;
  date: Date;
  completed: boolean;
}): HabitCompletion {
  return {
    habitId: completion.habitId,
    date: toDateString(completion.date),
    completed: completion.completed,
  };
}

export async function getHabits(userId: string) {
  const habits = await prisma.habit.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  return habits.map(toHabit);
}

export async function getHabitCompletions(userId: string, date: string) {
  const completions = await prisma.habitCompletion.findMany({
    where: { userId, date: toDate(date) },
    orderBy: { createdAt: "asc" },
  });

  return completions.map(toHabitCompletion);
}

export async function getHabitsForDate(userId: string, selectedDate: string) {
  const [habits, completions] = await Promise.all([
    getHabits(userId),
    getHabitCompletions(userId, selectedDate),
  ]);

  return {
    habits,
    visibleHabits: habits.filter((habit) =>
      isHabitVisible(habit, selectedDate),
    ),
    completions,
  };
}

export async function createHabit(userId: string, values: HabitFormValues) {
  const habit = await prisma.habit.create({
    data: {
      userId,
      title: values.title,
      description: values.description ?? null,
      startDate: toDate(values.startDate),
      recurrence: values.recurrence,
      interval: getInterval(values),
      daysOfWeek: getDaysOfWeek(values),
    },
  });

  return toHabit(habit);
}

export async function updateHabit(
  userId: string,
  id: Habit["id"],
  values: HabitFormValues,
) {
  const result = await prisma.habit.updateManyAndReturn({
    where: { id, userId },
    data: {
      title: values.title,
      description: values.description ?? null,
      startDate: toDate(values.startDate),
      recurrence: values.recurrence,
      interval: getInterval(values),
      daysOfWeek: getDaysOfWeek(values),
    },
  });

  return result[0] ? toHabit(result[0]) : null;
}

export async function deleteHabit(userId: string, id: Habit["id"]) {
  const result = await prisma.habit.deleteMany({
    where: { id, userId },
  });

  return result.count > 0;
}

export async function toggleHabitCompletion(
  userId: string,
  habitId: Habit["id"],
  date: string,
) {
  return prisma.$transaction(async (tx) => {
    const habit = await tx.habit.findFirst({
      where: { id: habitId, userId },
      select: { id: true },
    });

    if (!habit) return null;

    const completionDate = toDate(date);
    const existingCompletion = await tx.habitCompletion.findUnique({
      where: {
        habitId_date: {
          habitId,
          date: completionDate,
        },
      },
    });

    if (!existingCompletion) {
      const completion = await tx.habitCompletion.create({
        data: {
          habitId,
          userId,
          date: completionDate,
          completed: true,
        },
      });

      return toHabitCompletion(completion);
    }

    const completion = await tx.habitCompletion.update({
      where: { id: existingCompletion.id },
      data: { completed: !existingCompletion.completed },
    });

    return toHabitCompletion(completion);
  });
}
