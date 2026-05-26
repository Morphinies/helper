import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/shared/lib/auth/session";
import { toggleTaskDone } from "@/entities/task/server/repository";
import { getTaskId } from "../../_lib/validation";
import { handleRouteError } from "../../_lib/http";

type TaskToggleRouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, { params }: TaskToggleRouteContext) {
  try {
    const user = await requireCurrentUser();
    const { id } = await params;
    const task = await toggleTaskDone(user.id, getTaskId(id));

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    return handleRouteError(error);
  }
}
