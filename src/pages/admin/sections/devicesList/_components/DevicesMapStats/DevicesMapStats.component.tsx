import React from "react";
import styles from "@sections_admin/devicesList/Devices-list.sections.module.scss";

type MapStats = {
  total: number;
  active: number;
  blocked: number;
  byWaste: Record<string, number>;
};

interface Props {
  mapStats: MapStats;
  wasteColors: Record<string, string>;
}

export const DevicesMapStats: React.FC<Props> = ({ mapStats, wasteColors }) => {
  return (
    <div className={styles.mapStatsBar}>
      <div className={styles.mapStats}>
        <span>
          Dispositivi con GPS: <strong>{mapStats.total}</strong>
        </span>
        <span>
          Attivi: <strong>{mapStats.active}</strong>
        </span>
        <span>
          Bloccati: <strong>{mapStats.blocked}</strong>
        </span>

        <div className={styles.wasteStats}>
          {Object.entries(mapStats.byWaste).map(([waste, count]) => (
            <span
              key={waste}
              style={{
                color: wasteColors[waste] || "var(--text-primary)",
                fontWeight: "bold",
              }}
            >
              {waste}: {count}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
