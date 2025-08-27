import React from "react";
import { type LucideIcon } from "lucide-react";
import styles from "./Section-header.module.scss";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import { Select } from "@root/components/shared/select/Select.component";
import { useSession } from "@root/pages/admin/core/store/auth/hooks/useSession";
import { UserRoles } from "@root/utils/constants/userRoles";

type ButtonConfig = {
  onClick: () => void;
  variant?: "filled" | "outline";
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  label: string;
  disabled?: boolean;
};

type ComponentConfig = {
  component: React.ReactNode;
};

type ActionItem = ButtonConfig | ComponentConfig;

// props dedicate per la select clienti
type CustomerSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

type SectionHeaderProps = {
  title: string;
  subTitle?: string;
  buttons?: ActionItem[];
  customerSelect?: CustomerSelectProps; // opzionale
};

const isButtonConfig = (item: ActionItem): item is ButtonConfig =>
  "onClick" in item && "label" in item;

const isComponentConfig = (item: ActionItem): item is ComponentConfig =>
  "component" in item;

export const SectionHeaderComponent: React.FC<SectionHeaderProps> = ({
  title = "Title test",
  subTitle = "Subtitle test",
  buttons = [],
  customerSelect,
}) => {
  const { user } = useSession();
  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;

  return (
    <div className={styles.sectionHeader}>
      <div className={styles.sectionHeaderContent}>
        <div className={styles.sectionHeaderTitleSection}>
          <div className={styles.sectionHeaderTitleWrapper}>
            <h1 className={styles.sectionHeaderTitle}>{title}</h1>

            {customerSelect && isSuperAdmin && (
              <Select
                name="select-client"
                value={customerSelect.value}
                disabled={customerSelect.disabled || customerSelect.loading}
                required={false}
                iconPosition="left"
                placeholder={customerSelect.placeholder ?? "Seleziona cliente"}
                options={customerSelect.options}
                onChange={(val: any) =>
                  customerSelect.onChange(
                    typeof val === "string"
                      ? val
                      : String(val?.target?.value ?? "")
                  )
                }
              />
            )}
          </div>
          {subTitle && (
            <p className={styles.sectionHeaderSubtitle}>{subTitle}</p>
          )}
        </div>

        <div className={styles.sectionHeaderActions}>
          {buttons?.map((item, index) => {
            if (isComponentConfig(item)) {
              return (
                <div
                  key={`component-${index}`}
                  className={styles.customComponent}
                >
                  {item?.component}
                </div>
              );
            }
            if (isButtonConfig(item)) {
              return (
                <SimpleButton
                  key={`button-${index}`}
                  onClick={item?.onClick}
                  variant={item?.variant || "filled"}
                  color={item?.color || "primary"}
                  size={item?.size || "md"}
                  icon={item?.icon}
                  iconPosition={item?.iconPosition || "left"}
                  disabled={item?.disabled || false}
                >
                  {item?.label}
                </SimpleButton>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};
