import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/shared/lib/auth/session";
import { handleRouteError, readJsonObject } from "@/shared/lib/api/http";
import { deleteHabit, updateHabit } from "@/entities/habit/server/repository";
import { getHabitFormValues, getHabitId } from "../_lib/validation";

type HabitRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: HabitRouteContext) {
  try {
    const user = await requireCurrentUser();
    const { id } = await params;
    const body = await readJsonObject(request);
    const habit = await updateHabit(
      user.id,
      getHabitId(id),
      getHabitFormValues(body),
    );

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    return NextResponse.json({ habit });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_: Request, { params }: HabitRouteContext) {
  try {
    const user = await requireCurrentUser();
    const { id } = await params;
    const deleted = await deleteHabit(user.id, getHabitId(id));

    if (!deleted) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleRouteError(error);
  }
}
