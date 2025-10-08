import { useState, useEffect, useMemo } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "@root/pages/admin/core/store/store.hooks";
import { setWasteFilter } from "@store_admin/devices/devices.slice";
import {
  loadDevices,
  loadAllDevices,
} from "@store_admin/devices/devices.thunks";

/**
 * Hook personalizzato per gestire il filtro waste con baseline freeze
 * Mantiene la distribuzione baseline quando si applica un filtro waste
 */
export function useDevicesWasteFilter(
  allWasteByType: Record<string, number> | null,
  scopedCustomer: string | null,
  refetchMap: () => void
) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.devices.filters);

  // Waste distribution freeze (anche per customer scope):
  // - Baseline catturata (per scope corrente) quando applico per la prima volta un filtro waste
  // - Se rimuovo il filtro waste, baseline aggiornata ai dati correnti dello scope
  // - Se cambia scopedCustomer, reset baseline e waste filter (nuovo contesto)
  const [wasteBaseline, setWasteBaseline] = useState<{
    scopeKey: string | null;
    data: Record<string, number> | null;
  }>({ scopeKey: null, data: null });

  // Reset baseline e filtro waste quando cambia il customer (nuovo contesto)
  useEffect(() => {
    setWasteBaseline({ scopeKey: scopedCustomer || null, data: null });
  }, [scopedCustomer]);

  useEffect(() => {
    const scopeKey = scopedCustomer || null; // null rappresenta la vista globale
    const baselineMatchesScope = wasteBaseline.scopeKey === scopeKey;

    if (!filters.waste) {
      // Filtro waste rimosso -> aggiorna baseline ai dati attuali dello scope
      setWasteBaseline({ scopeKey, data: allWasteByType || null });
      return;
    }
    // Filtro waste attivo: se non abbiamo baseline per questo scope la catturiamo
    if ((!baselineMatchesScope || !wasteBaseline.data) && allWasteByType) {
      setWasteBaseline({ scopeKey, data: allWasteByType });
    }
  }, [
    filters.waste,
    allWasteByType,
    scopedCustomer,
    wasteBaseline.scopeKey,
    wasteBaseline.data,
  ]);

  const displayedWasteDistribution = useMemo(() => {
    // Usa baseline.data se presente per lo scope corrente, altrimenti live distribution
    if (wasteBaseline.data) return wasteBaseline.data;
    return allWasteByType || {};
  }, [wasteBaseline.data, allWasteByType]);

  const totalWasteBaseline = useMemo(() => {
    return Object.values(displayedWasteDistribution).reduce((a, b) => a + b, 0);
  }, [displayedWasteDistribution]);

  const handleWasteFilterToggle = (waste: string, isActive: boolean) => {
    const next = isActive ? null : waste.toLowerCase();
    dispatch(setWasteFilter(next));
    // reload data when waste changes
    dispatch(loadDevices({ page: 1 }));
    dispatch(loadAllDevices({}));
    refetchMap();
  };

  return {
    displayedWasteDistribution,
    totalWasteBaseline,
    activeWasteFilter: filters.waste,
    handleWasteFilterToggle,
  };
}
