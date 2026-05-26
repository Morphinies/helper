import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/shared/lib/auth/session";
import { toggleHabitCompletion } from "@/entities/habit/server/repository";
import { getHabitDate, getHabitId } from "../../_lib/validation";
import { handleRouteError, readJsonObject } from "../../_lib/http";

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
