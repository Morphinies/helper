import { BadRequestError } from "@/shared/lib/api/http";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const codePattern = /^\d{6}$/;
const minPasswordLength = 8;

export function getRegistrationValues(body: Record<string, unknown>) {
  const email = getEmail(body.email);
  const password = getPassword(body.password);

  return { email, password };
}

export function getRegistrationConfirmationValues(
  body: Record<string, unknown>,
) {
  const email = getEmail(body.email);

  if (typeof body.code !== "string" || !codePattern.test(body.code.trim())) {
    throw new BadRequestError("Confirmation code must contain 6 digits");
  }

  return {
    email,
    code: body.code.trim(),
  };
}

function getEmail(value: unknown) {
  if (typeof value !== "string" || !emailPattern.test(value.trim())) {
    throw new BadRequestError("Valid email is required");
  }

  return value.trim().toLowerCase();
}

function getPassword(value: unknown) {
  if (typeof value !== "string" || value.length < minPasswordLength) {
    throw new BadRequestError("Password must contain at least 8 characters");
  }

  return value;
}
