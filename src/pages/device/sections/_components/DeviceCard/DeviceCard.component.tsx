import React from "react";
import styles from "./DeviceCard.module.scss";

type Props = {
  /** Titolo della card (facoltativo). Se assente, niente header. */
  title?: React.ReactNode;
  /** Icona a sinistra del titolo (facoltativa). */
  icon?: React.ReactNode;
  /** Contenuto allineato a destra nell’header (facoltativo). */
  info?: React.ReactNode;
  /** Contenuto del body. */
  children?: React.ReactNode;
  /** ClassName extra sul wrapper card. */
  className?: string;
  /** ClassName extra sul body (utile per grid, padding custom, ecc.). */
  bodyClassName?: string;
};

export default function DeviceCard({
  title,
  icon,
  info,
  children,
  className,
  bodyClassName,
}: Props) {
  return (
    <div className={[styles.card, className].filter(Boolean).join(" ")}>
      {(title || info) && (
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            {icon}
            {title && <span>{title}</span>}
          </div>
          {info ? <div className={styles.cardInfo}>{info}</div> : null}
        </div>
      )}
      <div
        className={[styles.cardBody, bodyClassName].filter(Boolean).join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
