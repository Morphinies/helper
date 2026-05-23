import s from "./Habits.module.scss";
import dayjs from "dayjs";
import { Button, DatePicker, Flex } from "antd";
import { useTranslations } from "next-intl";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { shiftDate } from "../lib/date";

type DateNavigationProps = {
  selectedDate: string;
  onDateChange: (value: string) => void;
};

export function DateNavigation({
  selectedDate,
  onDateChange,
}: DateNavigationProps) {
  const t = useTranslations("habits");

  return (
    <Flex
      align="center"
      justify="center"
      gap="small"
      className={s["root__datebar"]}
    >
      <Button
        aria-label={t("dateNavigation.previousDay")}
        icon={<LeftOutlined />}
        onClick={() => onDateChange(shiftDate(selectedDate, -1))}
      />
      <DatePicker
        allowClear={false}
        className={s["root__datebar-date"]}
        format={t("dateFormat.short")}
        inputReadOnly
        suffixIcon={null}
        value={dayjs(selectedDate)}
        onChange={(date) => {
          if (date) onDateChange(date.format("YYYY-MM-DD"));
        }}
      />
      <Button
        aria-label={t("dateNavigation.nextDay")}
        icon={<RightOutlined />}
        onClick={() => onDateChange(shiftDate(selectedDate, 1))}
      />
    </Flex>
  );
}
