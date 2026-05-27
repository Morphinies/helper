import "server-only";

import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

const HASH_ITERATIONS = 210_000;
const HASH_KEY_LENGTH = 32;
const HASH_DIGEST = "sha256";
const HASH_SEPARATOR = ":";

export function hashSecret(secret: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(
    secret,
    salt,
    HASH_ITERATIONS,
    HASH_KEY_LENGTH,
    HASH_DIGEST,
  ).toString("hex");

  return [HASH_DIGEST, HASH_ITERATIONS, HASH_KEY_LENGTH, salt, hash].join(
    HASH_SEPARATOR,
  );
}

export function verifySecret(secret: string, storedHash: string) {
  const [digest, iterationsValue, keyLengthValue, salt, hash] =
    storedHash.split(HASH_SEPARATOR);
  const iterations = Number(iterationsValue);
  const keyLength = Number(keyLengthValue);

  if (!digest || !iterations || !keyLength || !salt || !hash) return false;

  const actualHash = pbkdf2Sync(
    secret,
    salt,
    iterations,
    keyLength,
    digest,
  ).toString("hex");
  const actualBuffer = Buffer.from(actualHash, "hex");
  const expectedBuffer = Buffer.from(hash, "hex");

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}
