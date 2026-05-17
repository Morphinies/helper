"use client";

import {
  Flex,
  Form,
  Modal,
  Input,
  theme,
  Empty,
  Space,
  Button,
  Divider,
  Checkbox,
  Typography,
  Spin,
} from "antd";
import s from "./Tasks.module.scss";
import { Fragment, useState } from "react";
import { useTasks } from "../model/useTasks";
import type { TaskCreate } from "../model/types";
import {
  PlusOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

export const Tasks = () => {
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { tasks, addTask, deleteTask, toggleTaskDone, isLoaded } = useTasks();
  const hasTasks = !!tasks.length;

  const onFinish = (values: TaskCreate) => {
    addTask(values);
    form.resetFields();
    setModalIsOpen(false);
  };

  return (
    <Flex flex={1} vertical gap={"medium"} className={s["root"]}>
      <Flex justify="space-between">
        <Title level={1}>Tasks</Title>
        <Button
          title="Add task"
          icon={<PlusOutlined />}
          onClick={() => setModalIsOpen(true)}
        />
      </Flex>

      <Flex
        flex={1}
        vertical
        justify={!isLoaded || !hasTasks ? "center" : "flex-start"}
      >
        {hasTasks ? (
          <ul>
            {tasks.map((item, index) => (
              <Fragment key={item.id}>
                {!!index && <Divider style={{ margin: 0 }} />}
                <li
                  style={{
                    display: "flex",
                    listStyle: "none",
                    padding: `${token.padding}px 0`,
                    justifyContent: "space-between",
                  }}
                >
                  <Flex gap="small" align="flex-start">
                    <Checkbox
                      style={{ marginTop: 4 }}
                      checked={item.status === "done"}
                      onChange={() => toggleTaskDone(item.id)}
                    />

                    <Flex vertical>
                      <Title style={{ marginBottom: 0 }} level={4}>
                        {item.title}
                      </Title>
                      {item.description && <Text>{item.description}</Text>}
                    </Flex>
                  </Flex>

                  <Space.Compact>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => deleteTask(item.id)}
                    ></Button>
                  </Space.Compact>
                </li>
              </Fragment>
            ))}
          </ul>
        ) : isLoaded ? (
          <Empty description="No tasks yet" />
        ) : (
          <Spin size="large" />
        )}
      </Flex>

      <Modal
        open={modalIsOpen}
        title="Task form"
        onOk={() => form.submit()}
        onCancel={() => setModalIsOpen(false)}
      >
        <Form
          form={form}
          variant="filled"
          layout="vertical"
          onFinish={onFinish}
          className={s["root__form"]}
        >
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea name="description" autoComplete="off" />
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  );
};
