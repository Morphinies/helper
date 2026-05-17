import { useState } from "react";
import { App, Form, type MenuProps } from "antd";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useTasks } from "./useTasks";
import type { Task, TaskFormValues } from "./types";
import { getEmptyTaskFormValues, getTaskFormValues } from "../lib/task";

export function useTasksView() {
  const [form] = Form.useForm<TaskFormValues>();
  const { modal: confirmModal } = App.useApp();
  const [modalTask, setModalTask] = useState<Task | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeActionsTaskId, setActiveActionsTaskId] = useState<string | null>(
    null,
  );
  const { tasks, addTask, updateTask, deleteTask, toggleTaskDone, isLoaded } =
    useTasks();

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

  return {
    topbar: {
      onAddTask: openCreateModal,
    },
    taskList: {
      tasks,
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
