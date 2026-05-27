import { useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  requestEmpty,
  requestJson,
  useApiErrorNotification,
} from "@/shared/lib/api/client";
import type { Habit, HabitCompletion, HabitFormValues } from "./types";

const habitsQueryKey = ["habits"] as const;

type HabitsResponse = {
  habits: Habit[];
  visibleHabits: Habit[];
  completions: HabitCompletion[];
};

type HabitResponse = {
  habit: Habit;
};

type HabitCompletionResponse = {
  completion: HabitCompletion;
};

function getHabitsQueryKey(selectedDate: string) {
  return [...habitsQueryKey, selectedDate] as const;
}

async function fetchHabits(selectedDate: string) {
  const searchParams = new URLSearchParams({ date: selectedDate });

  return requestJson<HabitsResponse>(`/api/habits?${searchParams}`);
}

async function createHabit(values: HabitFormValues) {
  return requestJson<HabitResponse>("/api/habits", {
    method: "POST",
    body: JSON.stringify(values),
  }).then(({ habit }) => habit);
}

async function updateHabitRequest(id: Habit["id"], values: HabitFormValues) {
  return requestJson<HabitResponse>(`/api/habits/${id}`, {
    method: "PATCH",
    body: JSON.stringify(values),
  }).then(({ habit }) => habit);
}

async function deleteHabitRequest(id: Habit["id"]) {
  return requestEmpty(`/api/habits/${id}`, {
    method: "DELETE",
  });
}

async function toggleHabitCompletionRequest({
  habitId,
  selectedDate,
}: {
  habitId: Habit["id"];
  selectedDate: string;
}) {
  return requestJson<HabitCompletionResponse>(
    `/api/habits/${habitId}/completion`,
    {
      method: "POST",
      body: JSON.stringify({ date: selectedDate }),
    },
  ).then(({ completion }) => completion);
}

function replaceHabit(habits: Habit[] | undefined, nextHabit: Habit) {
  return (habits ?? []).map((habit) =>
    habit.id === nextHabit.id ? nextHabit : habit,
  );
}

function updateCompletion(
  completions: HabitCompletion[] | undefined,
  nextCompletion: HabitCompletion,
) {
  const currentCompletions = completions ?? [];
  const completionIndex = currentCompletions.findIndex(
    (completion) =>
      completion.habitId === nextCompletion.habitId &&
      completion.date === nextCompletion.date,
  );

  if (completionIndex === -1) return [...currentCompletions, nextCompletion];

  return currentCompletions.map((completion, index) =>
    index === completionIndex ? nextCompletion : completion,
  );
}

export function useHabits(selectedDate: string) {
  const queryClient = useQueryClient();
  const notifyApiError = useApiErrorNotification();
  const queryKey = getHabitsQueryKey(selectedDate);
  const {
    data = {
      habits: [],
      visibleHabits: [],
      completions: [],
    },
    error: habitsError,
    isError: isHabitsError,
    isLoading,
  } = useQuery({
    queryKey,
    queryFn: () => fetchHabits(selectedDate),
  });
  const invalidateHabits = () =>
    queryClient.invalidateQueries({ queryKey: habitsQueryKey });

  const addHabitMutation = useMutation({
    mutationFn: createHabit,
    onSuccess: (habit) => {
      queryClient.setQueryData<HabitsResponse>(queryKey, (current) => ({
        habits: [...(current?.habits ?? []), habit],
        visibleHabits: current?.visibleHabits ?? [],
        completions: current?.completions ?? [],
      }));
    },
    onError: (error) => notifyApiError(error, "Не удалось создать привычку"),
    onSettled: invalidateHabits,
  });
  const updateHabitMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: Habit["id"];
      values: HabitFormValues;
    }) => updateHabitRequest(id, values),
    onSuccess: (habit) => {
      queryClient.setQueryData<HabitsResponse>(queryKey, (current) => ({
        habits: replaceHabit(current?.habits, habit),
        visibleHabits: replaceHabit(current?.visibleHabits, habit),
        completions: current?.completions ?? [],
      }));
    },
    onError: (error) => notifyApiError(error, "Не удалось обновить привычку"),
    onSettled: invalidateHabits,
  });
  const deleteHabitMutation = useMutation({
    mutationFn: deleteHabitRequest,
    onSuccess: (_, id) => {
      queryClient.setQueryData<HabitsResponse>(queryKey, (current) => ({
        habits: (current?.habits ?? []).filter((habit) => habit.id !== id),
        visibleHabits: (current?.visibleHabits ?? []).filter(
          (habit) => habit.id !== id,
        ),
        completions: (current?.completions ?? []).filter(
          (completion) => completion.habitId !== id,
        ),
      }));
    },
    onError: (error) => notifyApiError(error, "Не удалось удалить привычку"),
    onSettled: invalidateHabits,
  });
  const toggleCompletionMutation = useMutation({
    mutationFn: toggleHabitCompletionRequest,
    onSuccess: (completion) => {
      queryClient.setQueryData<HabitsResponse>(queryKey, (current) => ({
        habits: current?.habits ?? [],
        visibleHabits: current?.visibleHabits ?? [],
        completions: updateCompletion(current?.completions, completion),
      }));
    },
    onError: (error) =>
      notifyApiError(error, "Не удалось изменить отметку привычки"),
    onSettled: invalidateHabits,
  });

  useEffect(() => {
    if (!isHabitsError) return;

    notifyApiError(habitsError, "Не удалось загрузить привычки");
  }, [habitsError, isHabitsError, notifyApiError]);

  const completedHabitIds = useMemo(() => {
    return new Set(
      data.completions
        .filter(
          (completion) =>
            completion.date === selectedDate && completion.completed,
        )
        .map((completion) => completion.habitId),
    );
  }, [data.completions, selectedDate]);

  const addHabit = (values: HabitFormValues) => {
    addHabitMutation.mutate(values);
  };

  const updateHabit = (id: Habit["id"], values: HabitFormValues) => {
    updateHabitMutation.mutate({ id, values });
  };

  const deleteHabit = (id: Habit["id"]) => {
    deleteHabitMutation.mutate(id);
  };

  const toggleCompletion = (habitId: Habit["id"]) => {
    toggleCompletionMutation.mutate({ habitId, selectedDate });
  };

  return {
    habits: data.habits,
    visibleHabits: data.visibleHabits,
    completedHabitIds,
    isLoaded: !isLoading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
  };
}
