import { MenuProps } from "antd";
import { Link } from "@/i18n/navigation";

export type UnpreparedMenuItem = {
  key: string;
  href: string;
  labelKey: string;
};

type MenuItem = Required<MenuProps>["items"][number];

export type PreparedMenuItem = MenuItem & {
  href: string;
};

function prepareMenuItems(
  items: UnpreparedMenuItem[],
  pathname: string,
  getLabel: (key: string) => string,
): { items: PreparedMenuItem[]; selectedKeys: string[] } {
  const preparedItems: PreparedMenuItem[] = [];
  const selectedKeys = getSelectedMenuKeys(items, pathname);

  for (const { key, href, labelKey } of items) {
    const isActiveItem = selectedKeys.includes(key);

    preparedItems.push({
      key,
      href,
      label: (
        <Link href={href} aria-current={isActiveItem ? "page" : undefined}>
          {getLabel(labelKey)}
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
