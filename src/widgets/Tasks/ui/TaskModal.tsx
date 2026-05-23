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
import { statusOptions } from "../lib/task";
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
  return (
    <Modal
      open={open}
      destroyOnHidden
      title={task ? "Edit Task" : "Add Task"}
      okText={task ? "Save Changes" : "Create Task"}
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
