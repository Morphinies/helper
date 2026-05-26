import { BadRequestError } from "./http";

import type {
  HabitFormValues,
  HabitRecurrence,
} from "@/entities/habit/model/types";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const recurrenceValues = new Set<string>([
  "daily",
  "every_n_days",
  "weekly",
  "custom_weekdays",
]);

function getOptionalString(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") throw new BadRequestError();

  return value;
}

function getTitle(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    throw new BadRequestError("Habit title is required");
  }

  return value.trim();
}

function getDate(value: unknown, message: string) {
  if (typeof value !== "string" || !datePattern.test(value)) {
    throw new BadRequestError(message);
  }

  return value;
}

function getRecurrence(value: unknown): HabitRecurrence {
  if (typeof value !== "string" || !recurrenceValues.has(value)) {
    throw new BadRequestError("Invalid habit recurrence");
  }

  return value as HabitRecurrence;
}

function getInterval(value: unknown, recurrence: HabitRecurrence) {
  if (recurrence !== "every_n_days") return undefined;

  if (value === undefined || value === null || value === "") return 1;
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    throw new BadRequestError("Invalid habit interval");
  }

  return value;
}

function getDaysOfWeek(value: unknown, recurrence: HabitRecurrence) {
  if (recurrence !== "custom_weekdays") return undefined;
  if (value === undefined || value === null) return [];

  if (
    !Array.isArray(value) ||
    !value.every(
      (day) =>
        typeof day === "number" &&
        Number.isInteger(day) &&
        day >= 0 &&
        day <= 6,
    )
  ) {
    throw new BadRequestError("Invalid habit days of week");
  }

  return value;
}

export function getHabitId(value: unknown) {
  if (typeof value !== "string" || !value) {
    throw new BadRequestError("Habit id is required");
  }

  return value;
}

export function getHabitDate(value: unknown) {
  return getDate(value, "Invalid habit date");
}

export function getHabitFormValues(
  body: Record<string, unknown>,
): HabitFormValues {
  const recurrence = getRecurrence(body.recurrence);

  return {
    title: getTitle(body.title),
    description: getOptionalString(body.description),
    recurrence,
    interval: getInterval(body.interval, recurrence),
    daysOfWeek: getDaysOfWeek(body.daysOfWeek, recurrence),
    startDate: getDate(body.startDate, "Invalid habit start date"),
  };
}
