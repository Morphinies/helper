import { NextResponse } from "next/server";
import { handleRouteError, readJsonObject } from "@/shared/lib/api/http";
import { confirmRegistrationCode } from "@/features/auth/server/registration";
import { getRegistrationConfirmationValues } from "../_lib/validation";

export async function POST(request: Request) {
  try {
    const body = await readJsonObject(request);
    const values = getRegistrationConfirmationValues(body);

    await confirmRegistrationCode(values.email, values.code);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
