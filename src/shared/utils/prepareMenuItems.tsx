import { MenuProps } from "antd";
import Link from "next/link";

export type UnpreparedMenuItem = { key: string; label: string; href: string };

type MenuItem = Required<MenuProps>["items"][number];

export type PreparedMenuItem = MenuItem & {
  href: string;
};

function prepareMenuItems(
  items: UnpreparedMenuItem[],
  pathname: string,
): { items: PreparedMenuItem[]; selectedKeys: string[] } {
  const preparedItems: PreparedMenuItem[] = [];
  const selectedKeys = getSelectedMenuKeys(items, pathname);

  for (const { key, href, label } of items) {
    const isActiveItem = selectedKeys.includes(key);

    preparedItems.push({
      key,
      href,
      label: (
        <Link href={href} aria-current={isActiveItem ? "page" : undefined}>
          {label}
        </Link>
      ),
    });
  }

  return {
    items: preparedItems,
    selectedKeys,
  };
}

export function getSelectedMenuKeys(
  items: UnpreparedMenuItem[],
  pathname: string,
): string[] {
  return items
    .filter((item) =>
      item.href === "/"
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    .map((item) => item.key);
}

export default prepareMenuItems;
