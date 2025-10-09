import React from "react";
import styles from "./WasteDistributionBar.module.scss";

type Props = {
  wasteDistribution: Record<string, number>;
  totalBaseline: number;
  activeWasteFilter: string | null;
  wasteColors: Record<string, string>;
  onWasteClick: (waste: string, isActive: boolean) => void;
};

/**
 * Componente che visualizza la barra di distribuzione dei rifiuti
 * con chips cliccabili per filtrare
 */
export const WasteDistributionBar: React.FC<Props> = ({
  wasteDistribution,
  totalBaseline,
  activeWasteFilter,
  wasteColors,
  onWasteClick,
}) => {
  if (!wasteDistribution || Object.keys(wasteDistribution).length === 0) {
    return null;
  }

  const removeWasteFromURL = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("waste");
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <div className={styles.totalWasteBar}>
      <div className={styles.totalWasteLabel}>
        Distribuzione totale rifiuti:
      </div>
      <div className={styles.totalWasteChips}>
        {Object.entries(wasteDistribution).map(([waste, count]) => {
          const isActive = activeWasteFilter === waste;
          const perc =
            totalBaseline > 0 ? Math.round((count / totalBaseline) * 100) : 0;
          return (
            <button
              type="button"
              onClick={() => onWasteClick(waste, isActive)}
              key={`global-waste-${waste}`}
              className={
                styles.totalWasteChip +
                (isActive ? " " + styles.activeWasteChip : "")
              }
              style={{
                borderColor: wasteColors[waste] || "var(--border-color)",
                background: isActive
                  ? wasteColors[waste] || "var(--accent-color)"
                  : "color-mix(in srgb, var(--bg-secondary) 85%, var(--bg-primary))",
                color: isActive
                  ? "#fff"
                  : wasteColors[waste] || "var(--text-secondary)",
              }}
              title={`Filtra per ${waste} – totale baseline: ${count} (${perc}%)`}
            >
              <strong>{waste}</strong>{" "}
              <span className={styles.count}>{count}</span>
              <span style={{ fontSize: 9, opacity: 0.7 }}> {perc}%</span>
            </button>
          );
        })}
      </div>
      {activeWasteFilter && (
        <div className={styles.resetButtonContainer}>
          <button
            type="button"
            onClick={() => {
              console.log("reset waste filter");
              removeWasteFromURL();
              onWasteClick(null, false);
            }}
            className={styles.resetButton}
          >
            Reset Filtri
          </button>
        </div>
      )}
    </div>
  );
};
