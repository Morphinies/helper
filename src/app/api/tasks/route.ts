import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/shared/lib/auth/session";
import { handleRouteError, readJsonObject } from "@/shared/lib/api/http";
import { createTask, getTasks } from "@/entities/task/server/repository";
import { getTaskFormValues } from "./_lib/validation";

export async function GET() {
  try {
    const user = await requireCurrentUser();
    const tasks = await getTasks(user.id);

    return NextResponse.json({ tasks });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireCurrentUser();
    const body = await readJsonObject(request);
    const task = await createTask(user.id, getTaskFormValues(body));

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
