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
    const maxOrder = tasks.reduce(
      (max, task) => Math.max(max, task.order),
      0,
    );
    const newTask: Task = {
      id: crypto.randomUUID(),
      order: maxOrder + 1000,
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

  const moveTask = (id: string, status: Task["status"], order: number) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status, order } : task)),
    );
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    isLoaded,
    toggleTaskDone,
    moveTask,
  };
}
