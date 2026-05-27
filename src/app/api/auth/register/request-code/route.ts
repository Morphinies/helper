import { NextResponse } from "next/server";
import { handleRouteError, readJsonObject } from "@/shared/lib/api/http";
import { requestRegistrationCode } from "@/features/auth/server/registration";
import { getRegistrationValues } from "../_lib/validation";

export async function POST(request: Request) {
  try {
    const body = await readJsonObject(request);
    const values = getRegistrationValues(body);

    await requestRegistrationCode(values.email, values.password);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
