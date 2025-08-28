import React from "react";
import styles from "./SectionSummary.module.scss";

export type StatVariant =
  | "statCard--total"
  | "statCard--active"
  | "statCard--inactive"
  | "statCard--blocked"
  | "statCard--ready"
  | "statCard--open"
  | "statCard--closed"
  | "statCard--warning"
  | "statCard--error";

export type SummaryItem = {
  /** Numero da mostrare */
  number: number;
  /** Etichetta (es. "Attivi", "Aperti") */
  label: string;
  /** Variante di stile (vedi StatVariant) */
  variant: StatVariant;
  /** Classe extra opzionale */
  className?: string;
};

type SummaryBarProps = {
  /** Titolo mostrato nel layout mobile (in alto a sinistra) */
  title?: string;
  /** Testo del totale (in alto a destra nel layout mobile) */
  totalLabel?: string;
  /** Numero totale (opzionale: se non lo metti, lo calcolo come somma degli item) */
  totalNumber?: number;
  /** Card di statistiche da mostrare (ordine = ordine di render) */
  items: SummaryItem[];
  /** Classe extra sul wrapper */
  className?: string;
};

const StatCard: React.FC<SummaryItem> = ({
  number,
  label,
  variant,
  className = "",
}) => (
  <div className={`${styles.statCard} ${styles[variant]} ${className}`}>
    <div className={styles.statNumber}>{number}</div>
    <div className={styles.statLabel}>{label}</div>
  </div>
);

export const SummaryBar: React.FC<SummaryBarProps> = ({
  title = "",
  totalLabel = "totali",
  totalNumber,
  items,
  className = "",
}) => {
  const computedTotal =
    typeof totalNumber === "number"
      ? totalNumber
      : items.reduce((acc, it) => acc + (Number(it.number) || 0), 0);

  return (
    <div className={`${styles.summaryBar} ${className}`}>
      {/* Mobile */}
      <div className={styles.mobileLayout}>
        <div className={styles.mobileHeader}>
          {title ? <h3 className={styles.mobileTitle}>{title}</h3> : <span />}
          <div className={styles.mobileTotal}>
            <span className={styles.mobileTotalNumber}>{computedTotal}</span>
            <span className={styles.mobileTotalLabel}>{totalLabel}</span>
          </div>
        </div>

        <div className={styles.mobileStats}>
          {items.map((it, idx) => (
            <StatCard key={`${it.label}-${idx}`} {...it} />
          ))}
        </div>
      </div>

      {/* Desktop */}
      <div className={styles.desktopLayout}>
        <div className={styles.statsSection}>
          <StatCard
            number={computedTotal}
            label="Totali"
            variant="statCard--total"
          />

          <div className={styles.statDivider} />

          {items.map((it, idx) => (
            <StatCard key={`${it.label}-${idx}`} {...it} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryBar;
