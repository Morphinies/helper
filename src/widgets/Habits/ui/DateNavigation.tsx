import s from "./Habits.module.scss";
import dayjs from "dayjs";
import { Button, DatePicker, Flex } from "antd";
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
  return (
    <Flex
      align="center"
      justify="center"
      gap="small"
      className={s["root__datebar"]}
    >
      <Button
        aria-label="Previous day"
        icon={<LeftOutlined />}
        onClick={() => onDateChange(shiftDate(selectedDate, -1))}
      />
      <DatePicker
        allowClear={false}
        className={s["root__datebar-date"]}
        format="D MMM"
        inputReadOnly
        suffixIcon={null}
        value={dayjs(selectedDate)}
        onChange={(date) => {
          if (date) onDateChange(date.format("YYYY-MM-DD"));
        }}
      />
      <Button
        aria-label="Next day"
        icon={<RightOutlined />}
        onClick={() => onDateChange(shiftDate(selectedDate, 1))}
      />
    </Flex>
  );
}
