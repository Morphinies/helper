import dayjs from "dayjs";
import s from "./Tasks.module.scss";
import { forwardRef, type CSSProperties } from "react";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  Tag,
  Flex,
  Space,
  Button,
  Checkbox,
  Dropdown,
  Typography,
  type MenuProps,
} from "antd";
import { useTranslations } from "next-intl";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { getStatusLabel, type Task } from "@/entities/task";

const { Text, Title } = Typography;

type TaskItemProps = {
  task: Task;
  actionsVisible: boolean;
  menuItems: MenuProps["items"];
  onMenuClick: MenuProps["onClick"];
  onClick: (task: Task) => void;
  onMouseEnter: (id: string) => void;
  onMouseLeave: () => void;
  onToggleDone: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  dragging?: boolean;
  variant?: "list" | "board";
  style?: CSSProperties;
  dragAttributes?: DraggableAttributes;
  dragListeners?: SyntheticListenerMap;
};

export const TaskItem = forwardRef<HTMLLIElement, TaskItemProps>(
  function TaskItem(
    {
      task,
      actionsVisible,
      menuItems,
      onMenuClick,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onToggleDone,
      onEdit,
      onDelete,
      dragging = false,
      variant = "list",
      style,
      dragAttributes,
      dragListeners,
    },
    ref,
  ) {
    const t = useTranslations("tasks");
    const deadlineFormat = t("dateFormat.deadline");
    const isBoard = variant === "board";

    return (
      <Dropdown
        trigger={["contextMenu"]}
        menu={{
          items: menuItems,
          onClick: onMenuClick,
        }}
      >
        <li
          ref={ref}
          className={`${s["root__item"]} ${
            actionsVisible ? s["root__item_actions-visible"] : ""
          } ${dragging ? s["root__item_dragging"] : ""}`}
          role="button"
          tabIndex={0}
          style={style}
          {...dragAttributes}
          {...dragListeners}
          onClick={() => onClick(task)}
          onMouseEnter={() => onMouseEnter(task.id)}
          onMouseLeave={onMouseLeave}
          onKeyDown={(event) => {
            if (event.key !== "Enter" && event.key !== " ") return;

            event.preventDefault();
            onClick(task);
          }}
        >
          <Flex gap="small" align="flex-start" className={s["root__main"]}>
            {!isBoard && (
              <span onPointerDown={(event) => event.stopPropagation()}>
                <Checkbox
                  className={s["root__checkbox"]}
                  checked={task.status === "done"}
                  onClick={(event) => event.stopPropagation()}
                  onChange={() => onToggleDone(task.id)}
                />
              </span>
            )}

            <Flex vertical gap={4}>
              <Title level={4} className={s["root__title"]}>
                {task.title}
              </Title>
              {task.description && <Text>{task.description}</Text>}
              {isBoard && task.deadline && (
                <Text type="secondary">
                  {dayjs(task.deadline).format(deadlineFormat)}
                </Text>
              )}
            </Flex>
          </Flex>

          <Flex align="center" gap="small" className={s["root__meta"]}>
            {!isBoard && task.deadline && (
              <Text type="secondary">
                {dayjs(task.deadline).format(deadlineFormat)}
              </Text>
            )}
            {!isBoard && <Tag>{getStatusLabel(t, task.status)}</Tag>}
            <Space.Compact className={s["root__actions"]}>
              <Button
                aria-label={t("actions.editTask")}
                title={t("actions.editTask")}
                icon={<EditOutlined />}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(task);
                }}
              />
              <Button
                danger
                aria-label={t("actions.deleteTask")}
                title={t("actions.deleteTask")}
                icon={<DeleteOutlined />}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(task);
                }}
              />
            </Space.Compact>
          </Flex>
        </li>
      </Dropdown>
    );
  },
);
