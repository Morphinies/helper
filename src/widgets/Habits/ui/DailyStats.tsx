import s from "./Habits.module.scss";
import { Typography } from "antd";

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
  if (!isLoaded) return null;

  const percent = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0;
  const stats = totalCount
    ? `Completed ${completedCount} of ${totalCount} habits`
    : "No habits for this day";

  return (
    <div className={s["root__stats"]}>
      <Text strong>{stats}</Text>
      {!!totalCount && <Text type="secondary">{percent}% done</Text>}
    </div>
  );
}
