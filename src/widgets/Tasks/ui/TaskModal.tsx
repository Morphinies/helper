import dayjs, { type Dayjs } from "dayjs";
import s from "./Tasks.module.scss";
import {
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  type FormInstance,
} from "antd";
import type { Task, TaskFormValues } from "../model/types";
import { statusOptions } from "../lib/task";

type TaskModalProps = {
  form: FormInstance<TaskFormValues>;
  task: Task | null;
  open: boolean;
  onSubmit: (values: TaskFormValues) => void;
  onClose: () => void;
  onAfterOpenChange: (open: boolean) => void;
};

export function TaskModal({
  form,
  task,
  open,
  onSubmit,
  onClose,
  onAfterOpenChange,
}: TaskModalProps) {
  return (
    <Modal
      open={open}
      title={task ? "Edit Task" : "Add Task"}
      okText={task ? "Save Changes" : "Create Task"}
      onOk={() => form.submit()}
      onCancel={onClose}
      afterOpenChange={onAfterOpenChange}
      destroyOnHidden
    >
      <Form
        form={form}
        variant="filled"
        layout="vertical"
        onFinish={onSubmit}
        className={s["root__form"]}
        initialValues={{ status: "todo" }}
      >
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea autoComplete="off" />
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select options={statusOptions} />
        </Form.Item>
        <Form.Item
          name="deadline"
          label="Deadline"
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
