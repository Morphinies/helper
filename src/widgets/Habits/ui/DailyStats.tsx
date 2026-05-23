import s from "./Habits.module.scss";
import { Typography } from "antd";
import { useTranslations } from "next-intl";

const { Text } = Typography;

type DailyStatsProps = {
  completedCount: number;
  totalCount: number;
  isLoaded: boolean;
};

export function DailyStats({
  completedCount,
  totalCount,
  isLoaded,
}: DailyStatsProps) {
  const t = useTranslations("habits");

  if (!isLoaded) return null;

  const percent = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0;
  const stats = totalCount
    ? t("stats.completed", { completedCount, totalCount })
    : t("stats.empty");

  return (
    <div className={s["root__stats"]}>
      <Text strong>{stats}</Text>
      {!!totalCount && (
        <Text type="secondary">{t("stats.percentDone", { percent })}</Text>
      )}
    </div>
  );
}
