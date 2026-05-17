import dayjs, { type Dayjs } from "dayjs";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  type FormInstance,
} from "antd";
import type { Habit, HabitFormValues, HabitRecurrence } from "../model/types";
import s from "./Habits.module.scss";

const recurrenceOptions: { value: HabitRecurrence; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "every_n_days", label: "Every N Days" },
  { value: "weekly", label: "Weekly" },
  { value: "custom_weekdays", label: "Specific Days" },
];

const weekDays = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 0, label: "Sun" },
];

type WeekdayButtonsProps = {
  value?: number[];
  onChange?: (value: number[]) => void;
};

function WeekdayButtons({ value = [], onChange }: WeekdayButtonsProps) {
  const toggleDay = (day: number) => {
    const nextValue = value.includes(day)
      ? value.filter((selectedDay) => selectedDay !== day)
      : [...value, day];

    onChange?.(nextValue);
  };

  return (
    <div className={s["root__weekday-buttons"]}>
      {weekDays.map(({ value: day, label }) => (
        <Button
          key={day}
          type={value.includes(day) ? "primary" : "default"}
          className={s["root__weekday-button"]}
          onClick={() => toggleDay(day)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}

type HabitModalProps = {
  form: FormInstance<HabitFormValues>;
  habit: Habit | null;
  open: boolean;
  selectedDate: string;
  recurrence?: HabitRecurrence;
  onSubmit: (values: HabitFormValues) => void;
  onClose: () => void;
};

export function HabitModal({
  form,
  habit,
  open,
  selectedDate,
  recurrence,
  onSubmit,
  onClose,
}: HabitModalProps) {
  return (
    <Modal
      open={open}
      title={habit ? "Edit Habit" : "Add Habit"}
      okText={habit ? "Save Changes" : "Create Habit"}
      onOk={() => form.submit()}
      onCancel={onClose}
      wrapClassName={s["root"]}
      destroyOnHidden
    >
      <Form
        form={form}
        variant="filled"
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          recurrence: "daily",
          interval: 2,
          daysOfWeek: [],
          startDate: selectedDate,
        }}
      >
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea autoComplete="off" />
        </Form.Item>
        <Form.Item name="recurrence" label="Recurrence">
          <Select options={recurrenceOptions} />
        </Form.Item>
        {recurrence === "every_n_days" && (
          <Form.Item
            name="interval"
            label="Interval"
            rules={[{ required: true }]}
            extra="Every 2 days"
          >
            <InputNumber min={1} precision={0} style={{ width: "100%" }} />
          </Form.Item>
        )}
        {recurrence === "custom_weekdays" && (
          <Form.Item
            name="daysOfWeek"
            label="Days of Week"
            rules={[
              {
                validator: (_, value?: number[]) =>
                  value?.length
                    ? Promise.resolve()
                    : Promise.reject(new Error("Select at least one day")),
              },
            ]}
          >
            <WeekdayButtons />
          </Form.Item>
        )}
        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true }]}
          getValueProps={(value?: string) => ({
            value: value ? dayjs(value) : undefined,
          })}
          normalize={(value?: Dayjs | null) =>
            value ? value.format("YYYY-MM-DD") : ""
          }
        >
          <DatePicker allowClear={false} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
