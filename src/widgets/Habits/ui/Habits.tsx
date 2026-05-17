"use client";

import { useState } from "react";
const { Text, Title } = Typography;
import { Card, Divider, Flex, Radio, Typography } from "antd";

const views = [
  {
    value: "day",
    label: "Day",
  },
  {
    value: "week",
    label: "Week",
  },
  {
    value: "month",
    label: "Month",
  },
];

export const Habits = () => {
  const [view, setView] = useState("day");

  return (
    <Flex flex={1} vertical gap={"medium"}>
      <Flex justify="space-between">
        <Title level={1}>Habits</Title>
        <Flex>
          <Radio.Group
            value={view}
            onChange={(e) => setView(e.target.value)}
            style={{ marginBottom: 16 }}
          >
            {views.map(({ value, label }) => (
              <Radio.Button key={label} value={value}>
                {label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Flex>
      </Flex>

      <Flex flex={1} align="center" justify="center">
        <Flex gap={"middle"} justify="center">
          {[
            { id: 1, title: "Английский", description: "Заниматься 1 час" },
            { id: 2, title: "Спорт", description: "Заниматься 1 час" },
            { id: 3, title: "Frontend", description: "Заниматься 1 час" },
          ].map(({ id, title, description }) => (
            <Card size="medium" key={id} style={{ textAlign: "center" }}>
              <Title level={4} children={title} />
              <Divider size="small" />
              <Text children={description} />
            </Card>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
