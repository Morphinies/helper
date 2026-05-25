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
import { useTranslations } from "next-intl";
import s from "./Habits.module.scss";
import type { Habit, HabitFormValues, HabitRecurrence } from "@/entities/habit";

const recurrenceValues: HabitRecurrence[] = [
  "daily",
  "every_n_days",
  "weekly",
  "custom_weekdays",
];

const weekDays = [
  { value: 1, labelKey: "mon" },
  { value: 2, labelKey: "tue" },
  { value: 3, labelKey: "wed" },
  { value: 4, labelKey: "thu" },
  { value: 5, labelKey: "fri" },
  { value: 6, labelKey: "sat" },
  { value: 0, labelKey: "sun" },
];

type WeekdayButtonsProps = {
  value?: number[];
  onChange?: (value: number[]) => void;
};

function WeekdayButtons({ value = [], onChange }: WeekdayButtonsProps) {
  const t = useTranslations("habits");
  const toggleDay = (day: number) => {
    const nextValue = value.includes(day)
      ? value.filter((selectedDay) => selectedDay !== day)
      : [...value, day];

    onChange?.(nextValue);
  };

  return (
    <div className={s["root__weekday-buttons"]}>
      {weekDays.map(({ value: day, labelKey }) => (
        <Button
          key={day}
          type={value.includes(day) ? "primary" : "default"}
          className={s["root__weekday-button"]}
          onClick={() => toggleDay(day)}
        >
          {t(`weekdays.${labelKey}`)}
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
  const t = useTranslations("habits");
  const recurrenceOptions = recurrenceValues.map((value) => ({
    value,
    label: t(`recurrence.${value}`),
  }));

  return (
    <Modal
      open={open}
      title={habit ? t("modal.editTitle") : t("modal.addTitle")}
      okText={habit ? t("modal.save") : t("modal.create")}
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
        <Form.Item
          name="title"
          label={t("form.title")}
          rules={[{ required: true }]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="description" label={t("form.description")}>
          <Input.TextArea autoComplete="off" />
        </Form.Item>
        <Form.Item name="recurrence" label={t("form.recurrence")}>
          <Select options={recurrenceOptions} />
        </Form.Item>
        {recurrence === "every_n_days" && (
          <Form.Item
            name="interval"
            label={t("form.interval")}
            rules={[{ required: true }]}
            extra={t("form.intervalExtra")}
          >
            <InputNumber min={1} precision={0} style={{ width: "100%" }} />
          </Form.Item>
        )}
        {recurrence === "custom_weekdays" && (
          <Form.Item
            name="daysOfWeek"
            label={t("form.daysOfWeek")}
            rules={[
              {
                validator: (_, value?: number[]) =>
                  value?.length
                    ? Promise.resolve()
                    : Promise.reject(new Error(t("form.selectAtLeastOneDay"))),
              },
            ]}
          >
            <WeekdayButtons />
          </Form.Item>
        )}
        <Form.Item
          name="startDate"
          label={t("form.startDate")}
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
