import * as React from "react";
import styles from "../styles/TableCell.module.scss";

import type {
  TableColumn,
  SelectConfig,
  CustomColumn,
  ActionConfig,
  BooleanConfig,
  AvatarConfig as BaseAvatarConfig,
  BadgeConfig,
} from "../types/GenericTable.types";

// ---------------------------------------------------------------
// Local display configs (UI only)
// ---------------------------------------------------------------
export interface TextConfig {
  overflow?: "ellipsis" | "wrap" | "smart";
  maxLines?: number;
  maxWidth?: string;
  showTooltip?: boolean;
}

// Extend AvatarConfig to support text configs and dot-path for avatarField
export type AvatarConfig<T> = BaseAvatarConfig<T> & {
  /** Campo avatar come chiave o path annidato (es. "profile.photo.url") */
  avatarField?: keyof T | string;
  nameTextConfig?: TextConfig;
  emailTextConfig?: TextConfig;
};

// Column with optional UI-only configs
export type ColumnWithUi<
  T,
  K extends keyof T | string = keyof T | string
> = TableColumn<T, K> & {
  textConfig?: TextConfig;
  avatarConfig?: AvatarConfig<T>;
};

export interface TableCellProps<
  T,
  K extends keyof T | string = keyof T | string
> {
  column: ColumnWithUi<T, K>;
  item: T;
  value: unknown; // value già calcolato dal parent (accessor o key)
}

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
function getByDotPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (
      acc &&
      typeof acc === "object" &&
      key in (acc as Record<string, unknown>)
    ) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function toText(value: unknown): string {
  if (value == null) return "";
  return typeof value === "string" ? value : String(value);
}

// ---------------------------------------------------------------
// Component
// ---------------------------------------------------------------
export const TableCell = <T, K extends keyof T | string = keyof T | string>({
  column,
  item,
  value,
}: TableCellProps<T, K>): React.JSX.Element => {
  const renderTextWithConfig = (
    textValue: unknown,
    textConfig?: TextConfig
  ) => {
    const text = toText(textValue);
    if (!textConfig) return <span>{text}</span>;

    const {
      overflow = "ellipsis",
      maxLines = 3,
      maxWidth = "100%",
      showTooltip = true,
    } = textConfig;

    const base: React.CSSProperties = { maxWidth, overflow: "hidden" };

    const wrap: React.CSSProperties = {
      ...base,
      wordWrap: "break-word",
      whiteSpace: "normal",
      maxHeight: `${maxLines * 1.5}em`,
      display: "-webkit-box",
      WebkitLineClamp: maxLines,
      WebkitBoxOrient: "vertical",
      textOverflow: "ellipsis",
    };

    const single: React.CSSProperties = {
      ...base,
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    };

    let style: React.CSSProperties = single;
    if (overflow === "wrap") style = wrap;
    if (overflow === "smart") style = text.includes(" ") ? wrap : single;

    return (
      <div style={style} title={showTooltip ? text : undefined}>
        {text}
      </div>
    );
  };

  const renderContent = (): React.ReactNode => {
    switch (column.type) {
      case "text":
      case "email": {
        return (
          <div className={styles.textCell}>
            {value != null && toText(value) !== "" ? (
              renderTextWithConfig(value, column.textConfig)
            ) : (
              <span className={styles.notAvailable}>N/A</span>
            )}
          </div>
        );
      }

      case "avatar": {
        const avatarConfig: AvatarConfig<T> = column.avatarConfig ?? {};

        const rec = item as unknown as Record<PropertyKey, unknown>;

        const name: string = avatarConfig.nameField
          ? toText(rec[avatarConfig.nameField as PropertyKey])
          : toText(value);

        const email: string | null = avatarConfig.emailField
          ? toText(rec[avatarConfig.emailField as PropertyKey])
          : null;

        let avatarUrlUnknown: unknown = null;
        if (avatarConfig.avatarField) {
          avatarUrlUnknown =
            typeof avatarConfig.avatarField === "string"
              ? getByDotPath(item, avatarConfig.avatarField)
              : rec[avatarConfig.avatarField as PropertyKey];
        }
        const avatar_url =
          typeof avatarUrlUnknown === "string" ? avatarUrlUnknown : undefined;

        const size = avatarConfig.size ?? "md";

        return (
          <div className={styles.avatarContainer}>
            <div className={styles.avatarWrapper}>
              {avatar_url ? (
                <img
                  className={`${styles.avatarImage} ${styles[size]}`}
                  src={avatar_url}
                  alt={name || "Avatar"}
                />
              ) : (
                <div className={`${styles.avatarPlaceholder} ${styles[size]}`}>
                  <span className={styles.placeholderText}>
                    {(name || email || "U").charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className={styles.avatarInfo}>
              <div className={styles.avatarName}>
                {renderTextWithConfig(
                  name || "Nome non disponibile",
                  avatarConfig.nameTextConfig
                )}
              </div>
              {email && (
                <div className={styles.avatarEmail}>
                  {renderTextWithConfig(email, avatarConfig.emailTextConfig)}
                </div>
              )}
            </div>
          </div>
        );
      }

      case "badge": {
        const cfg: BadgeConfig | undefined = (
          column as Extract<typeof column, { type: "badge" }>
        ).badgeConfig;
        if (!cfg) {
          return (
            <span className={`${styles.badge} ${styles.default}`}>
              {toText(value ?? "N/A")}
            </span>
          );
        }
        const key = toText(value).toLowerCase();
        const info = cfg[key] ?? { label: toText(value), className: "default" };
        const css = styles as Record<string, string>;
        const classFromModule = css[info.className] ?? css.default ?? "";
        return (
          <span className={`${styles.badge} ${classFromModule}`}>
            {info.label}
          </span>
        );
      }

      case "select": {
        const sc = (column as Extract<typeof column, { type: "select" }>)
          .selectConfig as SelectConfig<T, string | number> | undefined;
        if (!sc) return value as React.ReactNode;
        const valueStr = value != null ? String(value) : "";
        return (
          <select
            value={valueStr}
            onChange={(e) => {
              const raw = e.currentTarget.value;
              const match = sc.options.find((o) => String(o.value) === raw);
              if (match) sc.onChange?.(item, match.value);
            }}
            className={styles.selectInput}
          >
            {sc.options.map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        );
      }

      case "boolean": {
        const cfg: BooleanConfig | undefined = (
          column as Extract<typeof column, { type: "boolean" }>
        ).booleanConfig;
        const isTrue = Boolean(value);
        return (
          <span
            className={`${styles.booleanText} ${
              isTrue ? styles.true : styles.false
            }`}
          >
            {isTrue ? cfg?.trueLabel ?? "Sì" : cfg?.falseLabel ?? "No"}
          </span>
        );
      }

      case "actions": {
        const actions =
          (column as Extract<typeof column, { type: "actions" }>).actions ??
          ([] as ActionConfig<T>[]);
        if (!actions.length) return null;
        return (
          <div className={styles.actionsContainer}>
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => action.onClick(item)}
                disabled={action.disabled?.(item)}
                className={styles.actionButton}
              >
                {action.icon && (
                  <span className={styles.actionIcon}>{action.icon}</span>
                )}
                {action.label}
              </button>
            ))}
          </div>
        );
      }

      case "custom": {
        // Cast del solo tipo di colonna a V=unknown per poter passare value senza "any"
        const c = column as CustomColumn<T, K, unknown>;
        return c.render ? c.render(value, item) : (value as React.ReactNode);
      }

      default:
        return renderTextWithConfig(
          value ?? "",
          (column as ColumnWithUi<T, K>).textConfig
        );
    }
  };

  return (
    <td
      className={styles.bodyCell}
      style={{ width: (column as { width?: string }).width }}
    >
      {renderContent()}
    </td>
  );
};
