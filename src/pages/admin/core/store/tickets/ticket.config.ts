import { TICKETS_API_CONFIG, TICKETS_PAGINATION } from "./ticket.constants";
import type { TicketsQueryParams } from "./ticket.types";

export const ticketsApiConfig = {
  tagTypes: ["ENTITY", "LIST", "STATS"] as const,
  keepUnusedDataFor: TICKETS_API_CONFIG.CACHE_TIME,
  retry: TICKETS_API_CONFIG.RETRY_ATTEMPTS,
};

export const defaultPagination = {
  page: 1,
  page_size: TICKETS_PAGINATION.DEFAULT_PAGE_SIZE,
};

export const defaultQueryParams: TicketsQueryParams = {
  ...defaultPagination,
  sortBy: "id",
  sortOrder: "desc",
  search: "",
};
