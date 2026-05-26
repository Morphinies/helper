import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/shared/lib/auth/session";
import { handleRouteError, readJsonObject } from "@/shared/lib/api/http";
import {
  createHabit,
  getHabitsForDate,
} from "@/entities/habit/server/repository";
import { getHabitDate, getHabitFormValues } from "./_lib/validation";

import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await requireCurrentUser();
    const selectedDate = getHabitDate(request.nextUrl.searchParams.get("date"));
    const { habits, visibleHabits, completions } = await getHabitsForDate(
      user.id,
      selectedDate,
    );

    return NextResponse.json({ habits, visibleHabits, completions });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireCurrentUser();
    const body = await readJsonObject(request);
    const habit = await createHabit(user.id, getHabitFormValues(body));

    return NextResponse.json({ habit }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
