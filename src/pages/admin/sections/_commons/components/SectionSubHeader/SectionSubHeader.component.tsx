import React from "react";
import { type LucideIcon } from "lucide-react";
import styles from "./SectionSubHeader.module.scss";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";

/** Config per i bottoni sottili secondari */
export type SubHeaderButtonConfig = {
  key?: string;
  onClick: () => void;
  label: string;
  icon?: LucideIcon;
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
  /** Variante cromatica minimale */
  color?: "primary" | "secondary" | "success" | "warning" | "error";
};

/** Permettiamo anche l'inserimento di componenti custom (es: select micro) */
export type SubHeaderCustomItem = { component: React.ReactNode; key?: string };

export type SectionSubHeaderItem = SubHeaderButtonConfig | SubHeaderCustomItem;

const isButton = (item: SectionSubHeaderItem): item is SubHeaderButtonConfig =>
  "onClick" in item && "label" in item;

interface SectionSubHeaderProps {
  items?: SectionSubHeaderItem[];
  className?: string;
  dense?: boolean; // padding ridotto
  divider?: boolean; // se mostrare una linea di separazione inferiore
  ariaLabel?: string;
}

/**
 * SectionSubHeader
 * Barra secondaria per filtri contestuali / azioni leggere.
 * - Design minimale
 * - Supporta bottoni "pill" e componenti custom
 */
export const SectionSubHeader: React.FC<SectionSubHeaderProps> = ({
  items = [],
  className = "",
  dense = false,
  divider = true,
  ariaLabel,
}) => {
  return (
    <div
      className={[
        styles.subHeader,
        dense ? styles.dense : "",
        divider ? styles.withDivider : "",
        className,
      ].join(" ")}
      aria-label={ariaLabel || "sezione filtri secondari"}
    >
      <div className={styles.itemsWrapper}>
        {items.map((item, idx) => {
          if (isButton(item)) {
            return (
              <SimpleButton
                key={item.key || `sub-btn-${idx}`}
                size="sm"
                variant={item.active ? "filled" : "outline"}
                color={item.color || "primary"}
                icon={item.icon}
                iconPosition="left"
                disabled={item.disabled}
                onClick={item.onClick}
                className={styles.subButton}
                aria-label={item.tooltip || item.label}
                data-tooltip={item.tooltip}
              >
                {item.label}
              </SimpleButton>
            );
          }
          return (
            <div
              key={item.key || `sub-custom-${idx}`}
              className={styles.customItem}
            >
              {item.component}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionSubHeader;
