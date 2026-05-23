import s from "./Habits.module.scss";
import { Card, Typography } from "antd";
import { useTranslations } from "next-intl";
import { PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

type AddHabitCardProps = {
  onAddHabit: () => void;
};

export function AddHabitCard({ onAddHabit }: AddHabitCardProps) {
  const t = useTranslations("habits");

  return (
    <Card
      hoverable
      role="button"
      tabIndex={0}
      className={`${s["root__habit-card"]} ${s["root__habit-card_add"]}`}
      onClick={onAddHabit}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();
        onAddHabit();
      }}
    >
      <PlusOutlined className={s["root__habit-card-add-icon"]} />
      <Text>{t("actions.addHabit")}</Text>
    </Card>
  );
}
