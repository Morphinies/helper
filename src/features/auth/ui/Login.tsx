"use client";

import { useState } from "react";
import { Alert, Button, Flex, Form, Input, Typography } from "antd";
import { useLocale, useTranslations } from "next-intl";
import { signIn, useSession } from "next-auth/react";
import { LoginOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

type LoginFormValues = {
  login: string;
  password: string;
};

export function Login() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const { status } = useSession();
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const callbackUrl = locale === "en" ? "/" : `/${locale}`;

  const onSubmit = async (values: LoginFormValues) => {
    setError(false);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      ...values,
      callbackUrl,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.ok) {
      window.location.href = result.url || callbackUrl;
      return;
    }

    setError(true);
  };

  return (
    <Flex flex={1} align="center" justify="center" vertical gap="middle">
      <Title level={1}>{t("signInTitle")}</Title>
      <Text type="secondary">{t("localSignInDescription")}</Text>
      <Form
        layout="vertical"
        initialValues={{ login: "admin", password: "admin" }}
        style={{ width: 280 }}
        onFinish={onSubmit}
      >
        <Form.Item
          name="login"
          label={t("login")}
          rules={[{ required: true, message: t("loginRequired") }]}
        >
          <Input autoComplete="username" />
        </Form.Item>
        <Form.Item
          name="password"
          label={t("password")}
          rules={[{ required: true, message: t("passwordRequired") }]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        {error && (
          <Alert
            showIcon
            type="error"
            title={t("invalidCredentials")}
            style={{ marginBottom: 16 }}
          />
        )}
        <Button
          block
          type="primary"
          htmlType="submit"
          loading={isSubmitting || status === "loading"}
          icon={<LoginOutlined />}
        >
          {t("signIn")}
        </Button>
      </Form>
      {/* <Text type="secondary">{t("oauthSignInDescription")}</Text>
      <Button
        size="large"
        loading={status === "loading"}
        icon={<LoginOutlined />}
        onClick={() => signIn("vk", { callbackUrl })}
      >
        {t("signInWithVk")}
      </Button> */}
    </Flex>
  );
}
