import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@root/store";

// Hook tipizzati personalizzati
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected>(
  selector: (state: RootState) => TSelected
): TSelected => useSelector(selector);
