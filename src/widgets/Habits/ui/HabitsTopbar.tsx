import s from "./Habits.module.scss";
import { Button, Flex, Radio, Typography } from "antd";
import { useTranslations } from "next-intl";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

const views = [
  { value: "day", disabled: false },
  { value: "week", disabled: true },
  { value: "month", disabled: true },
];

type HabitsTopbarProps = {
  view: string;
  editMode: boolean;
  onViewChange: (value: string) => void;
  onEditModeToggle: () => void;
  onAddHabit: () => void;
};

export function HabitsTopbar({
  view,
  editMode,
  onViewChange,
  onEditModeToggle,
  onAddHabit,
}: HabitsTopbarProps) {
  const t = useTranslations("habits");

  return (
    <Flex
      align="center"
      justify="space-between"
      gap="middle"
      className={s["root__topbar"]}
    >
      <Title level={1}>{t("title")}</Title>
      <Flex align="center" gap="small" wrap>
        <Button
          type={editMode ? "primary" : "default"}
          icon={<EditOutlined />}
          onClick={onEditModeToggle}
        >
          {t("actions.edit")}
        </Button>
        <Button
          aria-label={t("actions.addHabit")}
          title={t("actions.addHabit")}
          icon={<PlusOutlined />}
          onClick={onAddHabit}
        >
          {t("actions.add")}
        </Button>
        <Radio.Group
          value={view}
          onChange={(event) => onViewChange(event.target.value)}
        >
          {views.map(({ value, disabled }) => (
            <Radio.Button key={value} value={value} disabled={disabled}>
              {t(`views.${value}`)}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Flex>
    </Flex>
  );
}
