import { useMemo, useCallback } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "@root/pages/admin/core/store/store.hooks";
import {
  selectTickets,
  selectTicketsError,
  selectTicketsFilters,
  selectTicketsLoading,
  selectTicketsPagination,
} from "./ticket.selectors";
import {
  loadTickets,
  refreshTickets,
  createNewTicket,
  updateExistingTicket,
  deleteExistingTicket,
  performBulkTicketAction,
  loadAllTickets,
} from "./ticket.actions";

export const useTickets = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectTickets);
  const isLoading = useAppSelector(selectTicketsLoading);
  const error = useAppSelector(selectTicketsError);
  const pagination = useAppSelector(selectTicketsPagination);
  const filters = useAppSelector(selectTicketsFilters);

  const actions = useMemo(
    () => ({
      load: (params?: any) => dispatch(loadTickets(params)),
      refresh: () => dispatch(refreshTickets()),
      create: (data: any) => dispatch(createNewTicket(data)),
      update: (id: number, data: any) =>
        dispatch(updateExistingTicket({ id, data })),
      remove: (id: number) => dispatch(deleteExistingTicket(id)),
      bulk: (req: any) => dispatch(performBulkTicketAction(req)),

      loadAll: () => dispatch(loadAllTickets()),
    }),
    [dispatch]
  );

  const filterLocal = useCallback(
    (term: string) =>
      items.filter((t) =>
        JSON.stringify(t).toLowerCase().includes(term.toLowerCase())
      ),
    [items]
  );

  return {
    items,
    isLoading,
    error,
    pagination,
    filters,
    ...actions,
    filterLocal,
  };
};
