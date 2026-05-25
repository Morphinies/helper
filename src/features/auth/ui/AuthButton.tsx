"use client";

import { App, Button } from "antd";
import { useLocale, useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";

export function AuthButton() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const { modal } = App.useApp();
  const { status } = useSession();
  const callbackUrl = locale === "en" ? "/" : `/${locale}`;

  const confirmSignOut = () => {
    modal.confirm({
      title: t("signOutConfirmTitle"),
      okText: t("signOut"),
      cancelText: t("cancel"),
      onOk: () => signOut({ callbackUrl: `${callbackUrl}/login` }),
    });
  };

  if (status === "loading") {
    return <Button loading />;
  }

  if (status === "authenticated") {
    return (
      <Button
        title={t("signOut")}
        aria-label={t("signOut")}
        icon={<LogoutOutlined />}
        onClick={confirmSignOut}
      />
    );
  }

  return (
    <Button
      title={t("signIn")}
      aria-label={t("signIn")}
      icon={<LoginOutlined />}
      onClick={() => router.push("/login")}
    />
  );
}
