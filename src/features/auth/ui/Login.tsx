"use client";

import { useState } from "react";
import { App, Alert, Button, Flex, Form, Input, Typography } from "antd";
import { useLocale, useTranslations } from "next-intl";
import { signIn, useSession } from "next-auth/react";
import {
  LoginOutlined,
  MailOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { requestJson } from "@/shared/lib/api/client";

const { Text, Title } = Typography;

type AuthMode = "login" | "register" | "confirm";

type LoginFormValues = {
  login: string;
  password: string;
};

type RegisterFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

type ConfirmFormValues = {
  code: string;
};

export function Login() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const { notification } = App.useApp();
  const { status } = useSession();
  const [mode, setMode] = useState<AuthMode>("login");
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingPassword, setPendingPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const callbackUrl = locale === "en" ? "/" : `/${locale}`;

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
  };

  const signInWithCredentials = async (values: LoginFormValues) => {
    const result = await signIn("credentials", {
      ...values,
      callbackUrl,
      redirect: false,
    });

    if (result?.ok) {
      window.location.href = result.url || callbackUrl;
      return true;
    }

    return false;
  };

  const onLoginSubmit = async (values: LoginFormValues) => {
    setError("");
    setIsSubmitting(true);

    const signedIn = await signInWithCredentials(values);

    setIsSubmitting(false);

    if (!signedIn) setError(t("invalidCredentials"));
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    setError("");
    setIsSubmitting(true);

    try {
      await requestJson<{ ok: true }>("/api/auth/register/request-code", {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      setPendingEmail(values.email.trim().toLowerCase());
      setPendingPassword(values.password);
      switchMode("confirm");
      notification.success({
        title: t("confirmationCodeSent"),
        description: t("confirmationCodeSentDescription"),
        placement: "bottomRight",
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : t("registrationError"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onConfirmSubmit = async (values: ConfirmFormValues) => {
    setError("");
    setIsSubmitting(true);

    try {
      await requestJson<{ ok: true }>("/api/auth/register/confirm", {
        method: "POST",
        body: JSON.stringify({
          email: pendingEmail,
          code: values.code,
        }),
      });

      const signedIn = await signInWithCredentials({
        login: pendingEmail,
        password: pendingPassword,
      });

      if (!signedIn) {
        setError(t("registrationCompletedSignInFailed"));
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : t("confirmationError"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Flex flex={1} align="center" justify="center" vertical gap="middle">
      <Title level={1}>{t(getTitleKey(mode))}</Title>
      <Text type="secondary">{t(getDescriptionKey(mode))}</Text>

      {mode === "login" && (
        <LoginForm
          t={t}
          error={error}
          isSubmitting={isSubmitting || status === "loading"}
          onSubmit={onLoginSubmit}
          onRegisterClick={() => switchMode("register")}
        />
      )}

      {mode === "register" && (
        <RegisterForm
          t={t}
          error={error}
          isSubmitting={isSubmitting}
          onSubmit={onRegisterSubmit}
          onLoginClick={() => switchMode("login")}
        />
      )}

      {mode === "confirm" && (
        <ConfirmForm
          t={t}
          email={pendingEmail}
          error={error}
          isSubmitting={isSubmitting}
          onSubmit={onConfirmSubmit}
          onBackClick={() => switchMode("register")}
        />
      )}
    </Flex>
  );
}

function LoginForm({
  t,
  error,
  isSubmitting,
  onSubmit,
  onRegisterClick,
}: {
  t: ReturnType<typeof useTranslations<"auth">>;
  error: string;
  isSubmitting: boolean;
  onSubmit: (values: LoginFormValues) => void;
  onRegisterClick: () => void;
}) {
  return (
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
      <AuthError error={error} />
      <Button
        block
        type="primary"
        htmlType="submit"
        loading={isSubmitting}
        icon={<LoginOutlined />}
      >
        {t("signIn")}
      </Button>
      <AuthSwitchText
        text={t("noAccount")}
        action={t("register")}
        onClick={onRegisterClick}
      />
    </Form>
  );
}

function RegisterForm({
  t,
  error,
  isSubmitting,
  onSubmit,
  onLoginClick,
}: {
  t: ReturnType<typeof useTranslations<"auth">>;
  error: string;
  isSubmitting: boolean;
  onSubmit: (values: RegisterFormValues) => void;
  onLoginClick: () => void;
}) {
  return (
    <Form layout="vertical" style={{ width: 280 }} onFinish={onSubmit}>
      <Form.Item
        name="email"
        label={t("email")}
        rules={[
          { required: true, message: t("emailRequired") },
          { type: "email", message: t("emailInvalid") },
        ]}
      >
        <Input autoComplete="email" />
      </Form.Item>
      <Form.Item
        name="password"
        label={t("password")}
        rules={[
          { required: true, message: t("passwordRequired") },
          { min: 8, message: t("passwordMinLength") },
        ]}
      >
        <Input.Password autoComplete="new-password" />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        label={t("confirmPassword")}
        dependencies={["password"]}
        rules={[
          { required: true, message: t("confirmPasswordRequired") },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }

              return Promise.reject(new Error(t("passwordsDoNotMatch")));
            },
          }),
        ]}
      >
        <Input.Password autoComplete="new-password" />
      </Form.Item>
      <AuthError error={error} />
      <Button
        block
        type="primary"
        htmlType="submit"
        loading={isSubmitting}
        icon={<UserAddOutlined />}
      >
        {t("sendConfirmationCode")}
      </Button>
      <AuthSwitchText
        text={t("hasAccount")}
        action={t("signIn")}
        onClick={onLoginClick}
      />
    </Form>
  );
}

function ConfirmForm({
  t,
  email,
  error,
  isSubmitting,
  onSubmit,
  onBackClick,
}: {
  t: ReturnType<typeof useTranslations<"auth">>;
  email: string;
  error: string;
  isSubmitting: boolean;
  onSubmit: (values: ConfirmFormValues) => void;
  onBackClick: () => void;
}) {
  return (
    <Form layout="vertical" style={{ width: 280 }} onFinish={onSubmit}>
      <Text type="secondary">{t("confirmationCodeHint", { email })}</Text>
      <Form.Item
        name="code"
        label={t("confirmationCode")}
        rules={[
          { required: true, message: t("confirmationCodeRequired") },
          { len: 6, message: t("confirmationCodeLength") },
        ]}
      >
        <Input inputMode="numeric" autoComplete="one-time-code" />
      </Form.Item>
      <AuthError error={error} />
      <Button
        block
        type="primary"
        htmlType="submit"
        loading={isSubmitting}
        icon={<MailOutlined />}
      >
        {t("confirmRegistration")}
      </Button>
      <AuthSwitchText
        text={t("wrongEmail")}
        action={t("changeEmail")}
        onClick={onBackClick}
      />
    </Form>
  );
}

function AuthError({ error }: { error: string }) {
  if (!error) return null;

  return (
    <Alert showIcon type="error" title={error} style={{ marginBottom: 16 }} />
  );
}

function AuthSwitchText({
  text,
  action,
  onClick,
}: {
  text: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <Flex justify="center" gap={4} style={{ marginTop: 16 }}>
      <Text type="secondary">{text}</Text>
      <Typography.Link onClick={onClick}>{action}</Typography.Link>
    </Flex>
  );
}

function getTitleKey(mode: AuthMode) {
  if (mode === "register") return "signUpTitle";
  if (mode === "confirm") return "confirmEmailTitle";

  return "signInTitle";
}

function getDescriptionKey(mode: AuthMode) {
  if (mode === "register") return "signUpDescription";
  if (mode === "confirm") return "confirmEmailDescription";

  return "localSignInDescription";
}
