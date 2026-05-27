import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  requestEmpty,
  requestJson,
  useApiErrorNotification,
} from "@/shared/lib/api/client";
import type { Task, TaskFormValues } from "./types";

const tasksQueryKey = ["tasks"] as const;

type TasksResponse = {
  tasks: Task[];
};

type TaskResponse = {
  task: Task;
};

type MoveTaskValues = {
  id: Task["id"];
  status: Task["status"];
  order: Task["order"];
};

async function fetchTasks() {
  return requestJson<TasksResponse>("/api/tasks").then(({ tasks }) => tasks);
}

async function createTask(values: TaskFormValues) {
  return requestJson<TaskResponse>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(values),
  }).then(({ task }) => task);
}

async function updateTaskRequest(id: Task["id"], values: TaskFormValues) {
  return requestJson<TaskResponse>(`/api/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(values),
  }).then(({ task }) => task);
}

async function deleteTaskRequest(id: Task["id"]) {
  return requestEmpty(`/api/tasks/${id}`, {
    method: "DELETE",
  });
}

async function toggleTaskDoneRequest(id: Task["id"]) {
  return requestJson<TaskResponse>(`/api/tasks/${id}/toggle`, {
    method: "POST",
  }).then(({ task }) => task);
}

async function moveTaskRequest({ id, status, order }: MoveTaskValues) {
  return requestJson<TaskResponse>(`/api/tasks/${id}/move`, {
    method: "PATCH",
    body: JSON.stringify({ status, order }),
  }).then(({ task }) => task);
}

function replaceTask(tasks: Task[] | undefined, nextTask: Task) {
  return (tasks ?? []).map((task) =>
    task.id === nextTask.id ? nextTask : task,
  );
}

export function useTasks() {
  const queryClient = useQueryClient();
  const notifyApiError = useApiErrorNotification();
  const {
    data: tasks = [],
    error: tasksError,
    isError: isTasksError,
    isLoading,
  } = useQuery({
    queryKey: tasksQueryKey,
    queryFn: fetchTasks,
  });
  const invalidateTasks = () =>
    queryClient.invalidateQueries({ queryKey: tasksQueryKey });
  const addTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: (task) => {
      queryClient.setQueryData<Task[]>(tasksQueryKey, (current) => [
        ...(current ?? []),
        task,
      ]);
    },
    onError: (error) => notifyApiError(error, "Не удалось создать задачу"),
    onSettled: invalidateTasks,
  });
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, values }: { id: Task["id"]; values: TaskFormValues }) =>
      updateTaskRequest(id, values),
    onSuccess: (task) => {
      queryClient.setQueryData<Task[]>(tasksQueryKey, (current) =>
        replaceTask(current, task),
      );
    },
    onError: (error) => notifyApiError(error, "Не удалось обновить задачу"),
    onSettled: invalidateTasks,
  });
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTaskRequest,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Task[]>(tasksQueryKey, (current) =>
        (current ?? []).filter((task) => task.id !== id),
      );
    },
    onError: (error) => notifyApiError(error, "Не удалось удалить задачу"),
    onSettled: invalidateTasks,
  });
  const toggleTaskDoneMutation = useMutation({
    mutationFn: toggleTaskDoneRequest,
    onSuccess: (task) => {
      queryClient.setQueryData<Task[]>(tasksQueryKey, (current) =>
        replaceTask(current, task),
      );
    },
    onError: (error) => notifyApiError(error, "Не удалось изменить задачу"),
    onSettled: invalidateTasks,
  });
  const moveTaskMutation = useMutation({
    mutationFn: moveTaskRequest,
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey: tasksQueryKey });

      const previousTasks = queryClient.getQueryData<Task[]>(tasksQueryKey);

      queryClient.setQueryData<Task[]>(tasksQueryKey, (current) =>
        (current ?? []).map((task) =>
          task.id === values.id
            ? { ...task, status: values.status, order: values.order }
            : task,
        ),
      );

      return { previousTasks };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(tasksQueryKey, context?.previousTasks);
      notifyApiError(_, "Не удалось переместить задачу");
    },
    onSuccess: (task) => {
      queryClient.setQueryData<Task[]>(tasksQueryKey, (current) =>
        replaceTask(current, task),
      );
    },
    onSettled: invalidateTasks,
  });

  useEffect(() => {
    if (!isTasksError) return;

    notifyApiError(tasksError, "Не удалось загрузить задачи");
  }, [isTasksError, notifyApiError, tasksError]);

  const addTask = (values: TaskFormValues) => {
    addTaskMutation.mutate(values);
  };

  const updateTask = (id: Task["id"], values: TaskFormValues) => {
    updateTaskMutation.mutate({ id, values });
  };

  const deleteTask = (id: Task["id"]) => {
    deleteTaskMutation.mutate(id);
  };

  const toggleTaskDone = (id: string) => {
    toggleTaskDoneMutation.mutate(id);
  };

  const moveTask = (id: string, status: Task["status"], order: number) => {
    moveTaskMutation.mutate({ id, status, order });
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    isLoaded: !isLoading,
    toggleTaskDone,
    moveTask,
  };
}
