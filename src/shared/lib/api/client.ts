"use client";

import { useCallback } from "react";
import { App } from "antd";

type ApiErrorResponse = {
  error?: string;
};

export async function requestJson<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await getRequestErrorMessage(response));
  }

  return response.json() as Promise<T>;
}

export async function requestEmpty(url: string, init?: RequestInit) {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(await getRequestErrorMessage(response));
  }
}

export function useApiErrorNotification() {
  const { notification } = App.useApp();

  return useCallback(
    (error: unknown, title = "Не удалось выполнить запрос") => {
      notification.error({
        title,
        description:
          error instanceof Error
            ? error.message
            : "Попробуйте повторить позже.",
        placement: "bottomRight",
      });
    },
    [notification],
  );
}

async function getRequestErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as ApiErrorResponse;

    if (body.error) return body.error;
  } catch {
    // Ignore non-JSON error bodies and fall back to status text.
  }

  return `Request failed with status ${response.status}`;
}
