import { statusValues } from "@/entities/task/lib/task";
import { BadRequestError } from "./http";

import type { TaskFormValues, TaskStatus } from "@/entities/task/model/types";

const taskStatuses = new Set<string>(statusValues);

function getOptionalString(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") throw new BadRequestError();

  return value;
}

function getTitle(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    throw new BadRequestError("Task title is required");
  }

  return value.trim();
}

function getStatus(value: unknown): TaskStatus {
  if (typeof value !== "string" || !taskStatuses.has(value)) {
    throw new BadRequestError("Invalid task status");
  }

  return value as TaskStatus;
}

function getDeadline(value: unknown) {
  const deadline = getOptionalString(value);

  if (!deadline) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
    throw new BadRequestError("Invalid task deadline");
  }

  return deadline;
}

export function getTaskId(value: unknown) {
  if (typeof value !== "string" || !value) {
    throw new BadRequestError("Task id is required");
  }

  return value;
}

export function getTaskFormValues(body: Record<string, unknown>): TaskFormValues {
  return {
    title: getTitle(body.title),
    description: getOptionalString(body.description),
    status: getStatus(body.status),
    deadline: getDeadline(body.deadline),
  };
}

export function getTaskMoveValues(body: Record<string, unknown>) {
  const status = getStatus(body.status);

  if (typeof body.order !== "number" || !Number.isFinite(body.order)) {
    throw new BadRequestError("Invalid task order");
  }

  return {
    status,
    order: body.order,
  };
}
