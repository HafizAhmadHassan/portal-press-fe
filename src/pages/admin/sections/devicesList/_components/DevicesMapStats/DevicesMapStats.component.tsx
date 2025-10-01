import React from "react";
import styles from "@sections_admin/devicesList/Devices-list.sections.module.scss";

type MapStats = {
  total: number;
  active: number;
  inactive: number;
  blocked: number;
  ready: number;
  byWaste: Record<string, number>;
  byCities?: Record<string, number>;
  byCustomers?: Record<string, number>;
};

interface Props {
  mapStats: MapStats;
  wasteColors: Record<string, string>;
  allWasteByType: Record<string, number>;
}

export const DevicesMapStats: React.FC<Props> = ({
  mapStats,
  wasteColors,
  allWasteByType,
}) => {
  return (
    <div className={styles.mapStatsBar}>
      <div className={styles.mapStats}>
        <span>
          Macchine con GPS: <strong>{mapStats.total}</strong>
        </span>
        <span>
          Attivi: <strong>{mapStats.active}</strong>
        </span>
        <span>
          Inattivi: <strong>{mapStats.inactive}</strong>
        </span>
        <span>
          Bloccati: <strong>{mapStats.blocked}</strong>
        </span>
        <span>
          Pronti: <strong>{mapStats.ready}</strong>
        </span>

        <div className={styles.wasteStats}>
          {Object.entries(mapStats.byWaste).map(([waste, count]) => (
            <span
              key={`filtered-${waste}`}
              style={{
                color: wasteColors[waste] || "var(--text-primary)",
                fontWeight: "bold",
              }}
              title="Conteggio (solo dispositivi filtrati con GPS)"
            >
              {waste}: {count}
            </span>
          ))}
        </div>

        <div className={styles.wasteStats} style={{ marginTop: 4 }}>
          {Object.entries(allWasteByType).map(([waste, count]) => (
            <span
              key={`total-${waste}`}
              style={{
                color: wasteColors[waste] || "var(--text-secondary)",
                fontWeight: 500,
                opacity: 0.85,
              }}
              title="Distribuzione totale (tutti i dispositivi)"
            >
              {waste}: {count}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
