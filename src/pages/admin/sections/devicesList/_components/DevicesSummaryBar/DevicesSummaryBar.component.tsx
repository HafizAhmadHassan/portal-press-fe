import React from "react";
import type { Device } from "@store_admin/devices/devices.types";
import {
  SummaryBar,
  type SummaryItem,
} from "../../../_commons/components/SectionSummary/SectionSummary.component";

type Props = {
  devices: Device[];
  className?: string;
  onMetricClick?: (key: "active" | "inactive" | "blocked" | "ready") => void;
  onResetFilters?: () => void;
  activeFilter?: "active" | "inactive" | "blocked" | "ready" | null;
  /** Conteggi baseline non filtrati (quando un filtro è attivo) */
  baselineCounts?: {
    active: number;
    inactive: number;
    blocked: number;
    ready: number;
  };
  /** Se presente, indica che dobbiamo considerare il totale filtrato logicamente */
  useFilteredTotal?: boolean;
  /** Forza un totale fisso (non variabile). Se presente, ha priorità su qualsiasi calcolo dinamico */
  fixedTotalNumber?: number;
};

export const DevicesSummaryBar: React.FC<Props> = ({
  devices,
  className,
  onMetricClick,
  onResetFilters,
  activeFilter = null,
  baselineCounts,
  useFilteredTotal = true,
  fixedTotalNumber,
}) => {
  // === Baseline counts (prefer baselineCounts if provided) ===
  const baseline = {
    active:
      baselineCounts?.active ?? devices.filter((d) => d.status === 1).length,
    inactive:
      baselineCounts?.inactive ?? devices.filter((d) => d.status === 0).length,
    blocked:
      baselineCounts?.blocked ??
      devices.filter((d) => d.status_Machine_Blocked === true).length,
    ready:
      baselineCounts?.ready ??
      devices.filter((d) => d.status_READY_D75_3_7 === true).length,
  };

  // === Intersections (per variante B) ===
  const intersections = React.useMemo(() => {
    return {
      activeBlocked: devices.filter(
        (d) => d.status === 1 && d.status_Machine_Blocked === true
      ).length,
      inactiveBlocked: devices.filter(
        (d) => d.status === 0 && d.status_Machine_Blocked === true
      ).length,
      activeReady: devices.filter(
        (d) => d.status === 1 && d.status_READY_D75_3_7 === true
      ).length,
      inactiveReady: devices.filter(
        (d) => d.status === 0 && d.status_READY_D75_3_7 === true
      ).length,
    };
  }, [devices]);

  const filterAxis = !activeFilter
    ? null
    : activeFilter === "active" || activeFilter === "inactive"
    ? "status"
    : "flag"; // 'blocked' | 'ready'

  const selectedFilter = activeFilter; // alias semantic

  // Helper per ottenere intersezione corretta di una card con il filtro selezionato
  const getIntersectionValue = (
    category: "active" | "inactive" | "blocked" | "ready"
  ) => {
    if (!selectedFilter) return undefined;
    if (selectedFilter === category) {
      // Intersezione con sé stesso = baseline
      return baseline[category];
    }
    switch (selectedFilter) {
      case "active":
        if (category === "blocked") return intersections.activeBlocked;
        if (category === "ready") return intersections.activeReady;
        return undefined; // non mostriamo intersezioni per altra card status
      case "inactive":
        if (category === "blocked") return intersections.inactiveBlocked;
        if (category === "ready") return intersections.inactiveReady;
        return undefined;
      case "blocked":
        if (category === "active") return intersections.activeBlocked;
        if (category === "inactive") return intersections.inactiveBlocked;
        return undefined;
      case "ready":
        if (category === "active") return intersections.activeReady;
        if (category === "inactive") return intersections.inactiveReady;
        return undefined;
    }
  };

  const buildItem = (
    category: "active" | "inactive" | "blocked" | "ready"
  ): SummaryItem => {
    const isSameAxis =
      filterAxis === null
        ? false
        : (filterAxis === "status" &&
            (category === "active" || category === "inactive")) ||
          (filterAxis === "flag" &&
            (category === "blocked" || category === "ready"));

    const intersection = getIntersectionValue(category);
    const showDual =
      !!selectedFilter && !isSameAxis && intersection !== undefined;

    const labelMap = {
      active: "Attivi",
      inactive: "Inattivi",
      blocked: "Bloccati",
      ready: "Pronti",
    } as const;
    const variantMap = {
      active: "statCard--active",
      inactive: "statCard--inactive",
      blocked: "statCard--blocked",
      ready: "statCard--ready",
    } as const;

    return {
      number: showDual ? intersection! : baseline[category],
      secondaryNumber: showDual ? baseline[category] : undefined,
      secondaryTooltip: showDual ? "Baseline" : undefined,
      label: labelMap[category],
      variant: variantMap[category],
      active: selectedFilter === category,
      frozen: isSameAxis && !!selectedFilter, // stesso asse = baseline (congelato)
      tooltip: showDual
        ? "Intersezione con filtro attivo"
        : selectedFilter && isSameAxis
        ? "Baseline (asse filtrato)"
        : undefined,
    };
  };

  const items: SummaryItem[] = [
    buildItem("active"),
    buildItem("inactive"),
    buildItem("blocked"),
    buildItem("ready"),
  ];

  const rawTotal = devices.length;
  // Totale calcolato (manteniamo la logica precedente; può essere fisso)
  let displayedTotal = rawTotal;
  if (fixedTotalNumber !== undefined) {
    displayedTotal = fixedTotalNumber;
  } else if (useFilteredTotal && activeFilter) {
    if (filterAxis === "status") {
      displayedTotal = baseline.active + baseline.inactive; // baseline perché asse filtrato
    } else if (filterAxis === "flag") {
      const overlap = devices.filter(
        (d) => d.status_Machine_Blocked && d.status_READY_D75_3_7
      ).length;
      displayedTotal = baseline.blocked + baseline.ready - overlap;
    }
    if (displayedTotal > rawTotal) displayedTotal = rawTotal;
  }

  // Determina il totale mostrato: se nessun filtro attivo => rawTotal
  // Se filtro attivo su status -> totale = active+inactive (dinamici o baseline/dinamici mix)
  // Se filtro attivo su blocked/ready -> totale = blocked+ready (dinamici o baseline/dinamici mix)
  const axis = filterAxis;

  const totalBadge = activeFilter ? "filtrato" : undefined;

  const handleItemClick = (item: SummaryItem) => {
    if (!onMetricClick) return;
    if (item.label === "Attivi") onMetricClick("active");
    else if (item.label === "Inattivi") onMetricClick("inactive");
    else if (item.label === "Bloccati") onMetricClick("blocked");
    else if (item.label === "Pronti") onMetricClick("ready");
  };

  return (
    <SummaryBar
      className={className}
      title="Dashboard Macchine"
      totalLabel="macchine totali"
      totalNumber={displayedTotal}
      items={items}
      onItemClick={onMetricClick ? (it) => handleItemClick(it) : undefined}
      onTotalClick={onResetFilters}
      totalActive={activeFilter === null}
      totalBadge={totalBadge}
      filteredAxis={axis}
    />
  );
};

export default DevicesSummaryBar;
