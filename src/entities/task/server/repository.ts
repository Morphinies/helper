import "server-only";

import { prisma } from "@/shared/lib/db";
import type { Task, TaskFormValues } from "../model/types";
import type { TaskStatus as PrismaTaskStatus } from "@/generated/prisma/enums";

type TaskOrderUpdate = {
  id: Task["id"];
  status: Task["status"];
  order: Task["order"];
};

function toDate(value?: string) {
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

function toDateString(value: Date | null) {
  return value?.toISOString().slice(0, 10);
}

function toTask(task: {
  id: string;
  title: string;
  description: string | null;
  status: PrismaTaskStatus;
  deadline: Date | null;
  order: number;
}): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? undefined,
    status: task.status,
    deadline: toDateString(task.deadline),
    order: task.order,
  };
}

export async function getTasks(userId: string) {
  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { order: "asc" },
  });

  return tasks.map(toTask);
}

export async function createTask(userId: string, values: TaskFormValues) {
  const maxOrderTask = await prisma.task.findFirst({
    where: { userId },
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const task = await prisma.task.create({
    data: {
      userId,
      title: values.title,
      description: values.description ?? null,
      status: values.status,
      deadline: toDate(values.deadline),
      order: (maxOrderTask?.order ?? 0) + 1000,
    },
  });

  return toTask(task);
}

export async function updateTask(
  userId: string,
  id: Task["id"],
  values: TaskFormValues,
) {
  const result = await prisma.task.updateManyAndReturn({
    where: { id, userId },
    data: {
      title: values.title,
      description: values.description ?? null,
      status: values.status,
      deadline: toDate(values.deadline),
    },
  });

  return result[0] ? toTask(result[0]) : null;
}

export async function deleteTask(userId: string, id: Task["id"]) {
  const result = await prisma.task.deleteMany({
    where: { id, userId },
  });

  return result.count > 0;
}

export async function toggleTaskDone(userId: string, id: Task["id"]) {
  const task = await prisma.task.findFirst({
    where: { id, userId },
    select: { status: true },
  });

  if (!task) return null;

  const result = await prisma.task.updateManyAndReturn({
    where: { id, userId },
    data: {
      status: task.status === "done" ? "todo" : "done",
    },
  });

  return result[0] ? toTask(result[0]) : null;
}

export async function moveTask(
  userId: string,
  { id, status, order }: TaskOrderUpdate,
) {
  const result = await prisma.task.updateManyAndReturn({
    where: { id, userId },
    data: { status, order },
  });

  return result[0] ? toTask(result[0]) : null;
}
