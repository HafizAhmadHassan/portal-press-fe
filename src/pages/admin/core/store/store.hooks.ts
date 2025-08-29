// @root/store/hooks.ts
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@root/store";

// Hook tipizzati personalizzati per Redux
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected>(
  selector: (state: RootState) => TSelected
): TSelected => useSelector(selector);

// Hook di utilità per operazioni comuni
export const useAppStore = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state);

  return { dispatch, state };
};

// Hook per controllo loading globale (se hai un loading slice globale)
export const useGlobalLoading = () => {
  return useAppSelector((state) => {
    // Controlla se qualsiasi API slice sta caricando
    const apiQueries = Object.values(state.api?.queries || {});
    const isLoading = apiQueries.some(
      (query: any) => query?.status === "pending"
    );
    return isLoading;
  });
};
