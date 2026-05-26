import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/shared/lib/auth/session";
import { deleteTask, updateTask } from "@/entities/task/server/repository";
import { getTaskFormValues, getTaskId } from "../_lib/validation";
import { handleRouteError, readJsonObject } from "../_lib/http";

type TaskRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: TaskRouteContext) {
  try {
    const user = await requireCurrentUser();
    const { id } = await params;
    const body = await readJsonObject(request);
    const task = await updateTask(user.id, getTaskId(id), getTaskFormValues(body));

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_: Request, { params }: TaskRouteContext) {
  try {
    const user = await requireCurrentUser();
    const { id } = await params;
    const deleted = await deleteTask(user.id, getTaskId(id));

    if (!deleted) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleRouteError(error);
  }
}
