import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/shared/lib/auth/session";
import { handleRouteError, readJsonObject } from "@/shared/lib/api/http";
import { toggleHabitCompletion } from "@/entities/habit/server/repository";
import { getHabitDate, getHabitId } from "../../_lib/validation";

type HabitCompletionRouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  request: Request,
  { params }: HabitCompletionRouteContext,
) {
  try {
    const user = await requireCurrentUser();
    const { id } = await params;
    const body = await readJsonObject(request);
    const completion = await toggleHabitCompletion(
      user.id,
      getHabitId(id),
      getHabitDate(body.date),
    );

    if (!completion) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    return NextResponse.json({ completion });
  } catch (error) {
    return handleRouteError(error);
  }
}
