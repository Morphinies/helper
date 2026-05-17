import { useState } from "react";
import { App, Form, type MenuProps } from "antd";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useTasks } from "./useTasks";
import type { Task, TaskFormValues, TaskStatus } from "./types";
import { getEmptyTaskFormValues, getTaskFormValues } from "../lib/task";

export type TasksViewMode = "list" | "board";

function sortTasks(tasks: Task[]) {
  return [...tasks].sort((a, b) => a.order - b.order);
}

function getAverageOrder(prev?: Task, next?: Task) {
  if (prev && next) return (prev.order + next.order) / 2;
  if (prev) return prev.order + 1000;
  if (next) return next.order / 2;

  return 1000;
}

export function useTasksView() {
  const [form] = Form.useForm<TaskFormValues>();
  const { modal: confirmModal } = App.useApp();
  const [view, setView] = useState<TasksViewMode>("list");
  const [modalTask, setModalTask] = useState<Task | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeActionsTaskId, setActiveActionsTaskId] = useState<string | null>(
    null,
  );
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskDone,
    moveTask,
    isLoaded,
  } = useTasks();
  const sortedTasks = sortTasks(tasks);

  const openCreateModal = () => {
    setModalTask(null);
    setModalIsOpen(true);
  };

  const openEditModal = (task: Task) => {
    setActiveActionsTaskId(null);
    setModalTask(task);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalTask(null);
    form.resetFields();
  };

  const submitTask = (values: TaskFormValues) => {
    if (modalTask) {
      updateTask(modalTask.id, values);
    } else {
      addTask(values);
    }

    closeModal();
  };

  const setModalFormValues = (open: boolean) => {
    if (!open) return;

    form.setFieldsValue(
      modalTask ? getTaskFormValues(modalTask) : getEmptyTaskFormValues(),
    );
  };

  const confirmDelete = (task: Task) => {
    confirmModal.confirm({
      title: "Delete this task?",
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => deleteTask(task.id),
    });
  };

  const getTaskMenuItems = (task: Task): MenuProps["items"] => {
    const isDone = task.status === "done";

    return [
      {
        key: "complete",
        icon: <CheckOutlined />,
        label: isDone ? "Mark as Incomplete" : "Complete",
      },
      { key: "edit", icon: <EditOutlined />, label: "Edit" },
      { key: "delete", icon: <DeleteOutlined />, label: "Delete", danger: true },
    ];
  };

  const getTaskMenuClick = (task: Task): MenuProps["onClick"] => {
    return ({ key }) => {
      if (key === "complete") toggleTaskDone(task.id);
      if (key === "edit") openEditModal(task);
      if (key === "delete") confirmDelete(task);
    };
  };

  const getDropOrder = (taskId: string, status: Task["status"], index: number) => {
    const targetTasks = sortTasks(
      tasks.filter((task) => task.status === status && task.id !== taskId),
    );
    const normalizedIndex = Math.max(0, Math.min(index, targetTasks.length));
    const prev = targetTasks[normalizedIndex - 1];
    const next = targetTasks[normalizedIndex];

    return getAverageOrder(prev, next);
  };

  const moveTaskInList = (taskId: string, overTaskId: string) => {
    const movingTask = tasks.find((task) => task.id === taskId);
    if (!movingTask) return;

    const orderedTasks = sortTasks(tasks);
    const oldIndex = orderedTasks.findIndex((task) => task.id === taskId);
    const overIndex = orderedTasks.findIndex((task) => task.id === overTaskId);
    if (oldIndex === -1 || overIndex === -1 || oldIndex === overIndex) return;

    const nextIndex = oldIndex < overIndex ? overIndex : overIndex;
    const targetTasks = sortTasks(tasks.filter((task) => task.id !== taskId));
    const prev = targetTasks[nextIndex - 1];
    const next = targetTasks[nextIndex];

    moveTask(taskId, movingTask.status, getAverageOrder(prev, next));
  };

  const moveTaskInBoard = (taskId: string, status: TaskStatus, index: number) => {
    moveTask(taskId, status, getDropOrder(taskId, status, index));
  };

  return {
    topbar: {
      view,
      onViewChange: setView,
      onAddTask: openCreateModal,
    },
    taskList: {
      tasks: sortedTasks,
      isLoaded,
      activeActionsTaskId,
      getMenuItems: getTaskMenuItems,
      getMenuClick: getTaskMenuClick,
      onTaskClick: openEditModal,
      onTaskMouseEnter: setActiveActionsTaskId,
      onTaskMouseLeave: () => setActiveActionsTaskId(null),
      onToggleTaskDone: toggleTaskDone,
      onEditTask: openEditModal,
      onDeleteTask: confirmDelete,
      onMoveTask: moveTaskInList,
    },
    taskBoard: {
      tasks: sortedTasks,
      isLoaded,
      getMenuItems: getTaskMenuItems,
      getMenuClick: getTaskMenuClick,
      onTaskClick: openEditModal,
      onToggleTaskDone: toggleTaskDone,
      onEditTask: openEditModal,
      onDeleteTask: confirmDelete,
      onMoveTask: moveTaskInBoard,
    },
    modal: {
      form,
      task: modalTask,
      open: modalIsOpen,
      onSubmit: submitTask,
      onClose: closeModal,
      onAfterOpenChange: setModalFormValues,
    },
  };
}
