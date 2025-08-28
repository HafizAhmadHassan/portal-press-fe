import React, { useState } from "react";
import styles from "./Accordion.module.scss";
import { ChevronDown, type LucideIcon } from "lucide-react";

export type AccordionItemType = {
  id: number;
  title: string;
  content: React.ReactNode; // Accetta qualsiasi componente React
  icon?: LucideIcon;
  disabled?: boolean;
};

type AccordionProps = {
  items: AccordionItemType[];
  allowMultiple?: boolean;
  defaultOpenItems?: number[];
  variant?: "default" | "bordered" | "minimal";
  size?: "sm" | "md" | "lg";
  activeItems?: number;
};

export const Accordion: React.FC<AccordionProps> = ({
  items = [],
  allowMultiple = false,
  defaultOpenItems = [],
  variant = "default",
  size = "md",
  activeItems = 0,
}) => {
  const [openItems, setOpenItems] = useState<number[]>(defaultOpenItems);

  const toggleItem = (itemid: number) => {
    const item = items.find((item) => item?.id === itemid);
    if (item?.disabled) return;

    setOpenItems((prev) => {
      const isOpen = prev.includes(itemid);

      if (allowMultiple) {
        return isOpen ? prev.filter((id) => id !== itemid) : [...prev, itemid];
      } else {
        return isOpen ? [] : [itemid];
      }
    });
  };

  const isItemOpen = (itemid: number) => openItems.includes(itemid);

  return (
    <div className={`${styles.accordion} ${styles[variant]} ${styles[size]}`}>
      {items.map((item) => {
        const isOpen = isItemOpen(item?.id);
        const IconComponent = item?.icon;

        return (
          <div
            key={item?.id}
            className={`${styles.accordionItem} ${isOpen ? styles.open : ""} ${
              item?.disabled ? styles.disabled : ""
            }`}
          >
            <button
              className={styles.accordionHeader}
              onClick={() => toggleItem(item?.id)}
              disabled={item?.disabled}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item?.id}`}
            >
              <div className={styles.accordionHeaderContent}>
                {IconComponent && (
                  <span className={styles.accordionIcon}>
                    <IconComponent size={16} />
                  </span>
                )}
                <span className={styles.accordionTitle}>{item?.title}</span>
              </div>

              {activeItems > 0 && (
                <div className={styles.accordionActiveItems}>
                  {activeItems} Filtri Attivi
                </div>
              )}
              <ChevronDown
                className={`${styles.accordionChevron} ${
                  isOpen ? styles.rotated : ""
                }`}
                size={16}
              />
            </button>

            <div
              className={`${styles.accordionContent} ${
                isOpen ? styles.expanded : ""
              }`}
              id={`accordion-content-${item?.id}`}
              aria-hidden={!isOpen}
            >
              <div className={styles.accordionContentInner}>
                {item?.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
