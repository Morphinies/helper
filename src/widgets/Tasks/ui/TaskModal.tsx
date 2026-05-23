import {
  Form,
  Input,
  Modal,
  Select,
  DatePicker,
  type FormInstance,
} from "antd";
import s from "./Tasks.module.scss";
import dayjs, { type Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import { getStatusOptions } from "../lib/task";
import type { Task, TaskFormValues } from "../model/types";

type TaskModalProps = {
  open: boolean;
  task: Task | null;
  form: FormInstance<TaskFormValues>;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
  onAfterOpenChange: (open: boolean) => void;
};

export function TaskModal({
  form,
  task,
  open,
  onClose,
  onSubmit,
  onAfterOpenChange,
}: TaskModalProps) {
  const t = useTranslations("tasks");

  return (
    <Modal
      open={open}
      destroyOnHidden
      title={task ? t("modal.editTitle") : t("modal.addTitle")}
      okText={task ? t("modal.save") : t("modal.create")}
      onCancel={onClose}
      onOk={() => form.submit()}
      afterOpenChange={onAfterOpenChange}
    >
      <Form
        form={form}
        variant="filled"
        layout="vertical"
        onFinish={onSubmit}
        className={s["root__form"]}
        initialValues={{ status: "todo" }}
      >
        <Form.Item name="title" label={t("form.title")} rules={[{ required: true }]}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="description" label={t("form.description")}>
          <Input.TextArea autoComplete="off" />
        </Form.Item>
        <Form.Item name="status" label={t("form.status")} rules={[{ required: true }]}>
          <Select options={getStatusOptions(t)} />
        </Form.Item>
        <Form.Item
          name="deadline"
          label={t("form.deadline")}
          getValueProps={(value?: string) => ({
            value: value ? dayjs(value) : undefined,
          })}
          normalize={(value?: Dayjs | null) =>
            value ? value.format("YYYY-MM-DD") : undefined
          }
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
