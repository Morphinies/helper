import { NextResponse } from "next/server";
import { UnauthorizedError } from "@/shared/lib/auth/session";

export class BadRequestError extends Error {
  constructor(message = "Bad request") {
    super(message);
    this.name = "BadRequestError";
  }
}

export function handleRouteError(error: unknown) {
  if (error instanceof UnauthorizedError) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  if (error instanceof BadRequestError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  console.error(error);

  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export async function readJsonObject(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new BadRequestError("Request body must be an object");
    }

    return body as Record<string, unknown>;
  } catch (error) {
    if (error instanceof BadRequestError) throw error;

    throw new BadRequestError("Invalid JSON body");
  }
}
