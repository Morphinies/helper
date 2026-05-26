import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/shared/lib/auth/session";
import { handleRouteError, readJsonObject } from "@/shared/lib/api/http";
import { moveTask } from "@/entities/task/server/repository";
import { getTaskId, getTaskMoveValues } from "../../_lib/validation";

type TaskMoveRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: TaskMoveRouteContext) {
  try {
    const user = await requireCurrentUser();
    const { id } = await params;
    const body = await readJsonObject(request);
    const task = await moveTask(user.id, {
      id: getTaskId(id),
      ...getTaskMoveValues(body),
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    return handleRouteError(error);
  }
}
