import "server-only";

import { randomInt } from "crypto";
import { prisma } from "@/shared/lib/db";
import { BadRequestError } from "@/shared/lib/api/http";
import { hashSecret, verifySecret } from "@/shared/lib/auth/password";
import { sendMail } from "@/shared/lib/mail/sendMail";

const CODE_EXPIRES_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function createVerificationCode() {
  return randomInt(100_000, 1_000_000).toString();
}

export async function requestRegistrationCode(
  emailValue: string,
  password: string,
) {
  const email = normalizeEmail(emailValue);
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    throw new BadRequestError("User with this email already exists");
  }

  const code = createVerificationCode();

  await prisma.registrationVerification.upsert({
    where: { email },
    update: {
      passwordHash: hashSecret(password),
      codeHash: hashSecret(code),
      attempts: 0,
      expiresAt: new Date(Date.now() + CODE_EXPIRES_MS),
    },
    create: {
      email,
      passwordHash: hashSecret(password),
      codeHash: hashSecret(code),
      expiresAt: new Date(Date.now() + CODE_EXPIRES_MS),
    },
  });

  await sendMail({
    to: email,
    subject: "Helper registration code",
    text: `Your Helper confirmation code: ${code}`,
  });
}

export async function confirmRegistrationCode(
  emailValue: string,
  code: string,
) {
  const email = normalizeEmail(emailValue);
  const verification = await prisma.registrationVerification.findUnique({
    where: { email },
  });

  if (!verification) {
    throw new BadRequestError("Confirmation code was not requested");
  }

  if (verification.expiresAt.getTime() < Date.now()) {
    await prisma.registrationVerification.delete({ where: { email } });
    throw new BadRequestError("Confirmation code expired");
  }

  if (verification.attempts >= MAX_ATTEMPTS) {
    await prisma.registrationVerification.delete({ where: { email } });
    throw new BadRequestError("Too many confirmation attempts");
  }

  if (!verifySecret(code, verification.codeHash)) {
    await prisma.registrationVerification.update({
      where: { email },
      data: { attempts: { increment: 1 } },
    });
    throw new BadRequestError("Invalid confirmation code");
  }

  await prisma.$transaction([
    prisma.user.create({
      data: {
        email,
        name: email,
        passwordHash: verification.passwordHash,
        emailVerified: new Date(),
      },
    }),
    prisma.registrationVerification.delete({ where: { email } }),
  ]);
}
