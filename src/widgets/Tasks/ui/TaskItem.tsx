import dayjs from "dayjs";
import s from "./Tasks.module.scss";
import {
  Button,
  Checkbox,
  Dropdown,
  Flex,
  Space,
  Tag,
  Typography,
  type MenuProps,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { Task } from "../model/types";
import { statusLabels } from "../lib/task";

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
};

export function TaskItem({
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
}: TaskItemProps) {
  return (
    <Dropdown
      trigger={["contextMenu"]}
      menu={{
        items: menuItems,
        onClick: onMenuClick,
      }}
    >
      <li
        className={`${s["root__item"]} ${
          actionsVisible ? s["root__item_actions-visible"] : ""
        }`}
        role="button"
        tabIndex={0}
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
          <Checkbox
            className={s["root__checkbox"]}
            checked={task.status === "done"}
            onClick={(event) => event.stopPropagation()}
            onChange={() => onToggleDone(task.id)}
          />

          <Flex vertical gap={4}>
            <Title level={4} className={s["root__title"]}>
              {task.title}
            </Title>
            {task.description && <Text>{task.description}</Text>}
          </Flex>
        </Flex>

        <Flex align="center" gap="small" className={s["root__meta"]}>
          {task.deadline && (
            <Text type="secondary">{dayjs(task.deadline).format("D MMM YYYY")}</Text>
          )}
          <Tag>{statusLabels[task.status]}</Tag>
          <Space.Compact className={s["root__actions"]}>
            <Button
              aria-label="Edit task"
              title="Edit task"
              icon={<EditOutlined />}
              onClick={(event) => {
                event.stopPropagation();
                onEdit(task);
              }}
            />
            <Button
              danger
              aria-label="Delete task"
              title="Delete task"
              icon={<DeleteOutlined />}
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
}
