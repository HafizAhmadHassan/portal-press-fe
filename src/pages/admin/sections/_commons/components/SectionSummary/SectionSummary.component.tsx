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
  /** Numero primario (in evidenza) */
  number: number;
  /** Numero secondario (baseline o totale originale) */
  secondaryNumber?: number;
  /** Tooltip del numero secondario */
  secondaryTooltip?: string;
  /** Etichetta (es. "Attivi", "Aperti") */
  label: string;
  /** Variante di stile (vedi StatVariant) */
  variant: StatVariant;
  /** Classe extra opzionale */
  className?: string;
  /** Stato attivo ( evidenziato ) */
  active?: boolean;
  /** Se true: card "congelata" (baseline) */
  frozen?: boolean;
  /** Tooltip opzionale */
  tooltip?: string;
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
  /** Optional click handler: if provided, cards become buttons */
  onItemClick?: (item: SummaryItem, index: number) => void;
  /** Optional total click (reset) */
  onTotalClick?: () => void;
  /** Evidenzia il totale (se c'è un filtro attivo) */
  totalActive?: boolean;
  /** Badge mostrato accanto al totale (es: "filtrato") */
  totalBadge?: string;
  /** Axis filtrata per messaggi tooltip ("status" | "flag") */
  filteredAxis?: string | null;
};

interface StatCardProps extends SummaryItem {
  onClick?: () => void;
  active?: boolean;
}
const StatCard: React.FC<StatCardProps> = ({
  number,
  secondaryNumber,
  secondaryTooltip,
  label,
  variant,
  className = "",
  onClick,
  active = false,
  frozen = false,
  tooltip,
}) => {
  const isButton = typeof onClick === "function";
  const commonProps: { className: string } = {
    className: `${styles.statCard} ${styles[variant]} ${className} ${
      isButton ? styles.clickable : ""
    } ${active ? styles.active : ""} ${frozen ? styles.frozen : ""}`.trim(),
  };
  if (isButton) {
    return (
      <button
        {...commonProps}
        onClick={onClick}
        type="button"
        aria-pressed={active}
        title={tooltip}
      >
        <div className={styles.statNumberWrapper}>
          <div className={styles.statNumber}>{number}</div>
          {typeof secondaryNumber === "number" && (
            <div
              className={styles.statSecondaryNumber}
              title={secondaryTooltip}
            >
              {secondaryNumber}
            </div>
          )}
        </div>
        <div className={styles.statLabel}>{label}</div>
      </button>
    );
  }
  return (
    <div {...commonProps} title={tooltip}>
      <div className={styles.statNumberWrapper}>
        <div className={styles.statNumber}>{number}</div>
        {typeof secondaryNumber === "number" && (
          <div className={styles.statSecondaryNumber} title={secondaryTooltip}>
            {secondaryNumber}
          </div>
        )}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
};

export const SummaryBar: React.FC<SummaryBarProps> = ({
  title = "",
  totalLabel = "totali",
  totalNumber,
  items,
  className = "",
  onItemClick,
  onTotalClick,
  totalActive = false,
  totalBadge,
  filteredAxis = null,
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
            <StatCard
              key={`${it.label}-${idx}`}
              {...it}
              onClick={onItemClick ? () => onItemClick(it, idx) : undefined}
            />
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
            onClick={onTotalClick}
            active={totalActive}
            tooltip={
              totalActive
                ? "Totale completo"
                : filteredAxis === "status"
                ? "Totale filtrato (asse stato: Attivi/Inattivi)"
                : filteredAxis === "flag"
                ? "Totale filtrato (asse flag: Bloccati/Pronti)"
                : "Totale filtrato"
            }
          />
          {!totalActive && totalBadge && (
            <span className={styles.totalBadge}>{totalBadge}</span>
          )}

          <div className={styles.statDivider} />

          {items.map((it, idx) => (
            <StatCard
              key={`${it.label}-${idx}`}
              {...it}
              active={it.active}
              frozen={it.frozen}
              onClick={onItemClick ? () => onItemClick(it, idx) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryBar;
