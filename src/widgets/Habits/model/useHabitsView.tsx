import { useState } from "react";
import { useTranslations } from "next-intl";
import { App, Form, type MenuProps } from "antd";
import { CheckOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  useHabits,
  getFormValues,
  toDateInputValue,
  type Habit,
  type HabitFormValues,
} from "@/entities/habit";

export function useHabitsView() {
  const t = useTranslations("habits");
  const [form] = Form.useForm<HabitFormValues>();
  const { modal: confirmModal } = App.useApp();
  const [view, setView] = useState("day");
  const [editMode, setEditMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() =>
    toDateInputValue(new Date()),
  );
  const [modalHabit, setModalHabit] = useState<Habit | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const recurrence = Form.useWatch("recurrence", form);
  const {
    visibleHabits,
    completedHabitIds,
    isLoaded,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
  } = useHabits(selectedDate);

  const completedCount = visibleHabits.filter((habit) =>
    completedHabitIds.has(habit.id),
  ).length;

  const openCreateModal = () => {
    setModalHabit(null);
    form.setFieldsValue({
      title: "",
      description: "",
      recurrence: "daily",
      interval: 2,
      daysOfWeek: [],
      startDate: selectedDate,
    });
    setModalIsOpen(true);
  };

  const openEditModal = (habit: Habit) => {
    setModalHabit(habit);
    form.setFieldsValue(getFormValues(habit));
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalHabit(null);
    form.resetFields();
  };

  const submitHabit = (values: HabitFormValues) => {
    if (modalHabit) {
      updateHabit(modalHabit.id, values);
    } else {
      addHabit(values);
    }

    closeModal();
  };

  const confirmDelete = (habit: Habit) => {
    confirmModal.confirm({
      title: t("confirm.deleteTitle"),
      okText: t("actions.delete"),
      okButtonProps: { danger: true },
      cancelText: t("actions.cancel"),
      onOk: () => deleteHabit(habit.id),
    });
  };

  const getHabitMenuItems = (habit: Habit): MenuProps["items"] => {
    const isCompleted = completedHabitIds.has(habit.id);

    return [
      {
        key: "complete",
        icon: <CheckOutlined />,
        label: isCompleted
          ? t("actions.markIncomplete")
          : t("actions.complete"),
      },
      { key: "edit", icon: <EditOutlined />, label: t("actions.edit") },
      {
        key: "delete",
        icon: <DeleteOutlined />,
        label: t("actions.delete"),
        danger: true,
      },
    ];
  };

  const getHabitMenuClick = (habit: Habit): MenuProps["onClick"] => {
    return ({ key }) => {
      if (key === "complete") toggleCompletion(habit.id);
      if (key === "edit") openEditModal(habit);
      if (key === "delete") confirmDelete(habit);
    };
  };

  return {
    topbar: {
      view,
      editMode,
      onViewChange: setView,
      onEditModeToggle: () => setEditMode((prev) => !prev),
      onAddHabit: openCreateModal,
    },
    dateNavigation: {
      selectedDate,
      onDateChange: setSelectedDate,
    },
    habitList: {
      habits: visibleHabits,
      editMode,
      isLoaded,
      completedHabitIds,
      getMenuItems: getHabitMenuItems,
      getMenuClick: getHabitMenuClick,
      onAddHabit: openCreateModal,
      onEditHabit: openEditModal,
      onToggleCompletion: toggleCompletion,
    },
    stats: {
      isLoaded,
      completedCount,
      totalCount: visibleHabits.length,
    },
    finishEditing: {
      visible: editMode && isLoaded,
      onClick: () => setEditMode(false),
    },
    modal: {
      form,
      habit: modalHabit,
      open: modalIsOpen,
      selectedDate,
      recurrence,
      onSubmit: submitHabit,
      onClose: closeModal,
    },
  };
}
