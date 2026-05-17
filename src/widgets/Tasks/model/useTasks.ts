import { useEffect, useState } from "react";
import { readTasks, writeTasks } from "./storage";
import type { Task, TaskFormValues } from "./types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setTasks(readTasks());
      setIsLoaded(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    writeTasks(tasks);
  }, [isLoaded, tasks]);

  const addTask = (values: TaskFormValues) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...values,
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: Task["id"], values: TaskFormValues) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...values } : task)),
    );
  };

  const deleteTask = (id: Task["id"]) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleTaskDone = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, status: task.status === "done" ? "todo" : "done" }
          : task,
      ),
    );
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    isLoaded,
    toggleTaskDone,
  };
}
