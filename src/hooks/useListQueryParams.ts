import { useCallback, useState } from "react";

export const useListQueryParams = ({ initialFilters = {} } = {}) => {
  const [filters, setFilters] = useState({ ...initialFilters });
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const setFilter = useCallback((key: string, valueOrEvent: any) => {
    let value;

    if (valueOrEvent && valueOrEvent.target) {
      value = valueOrEvent.target.value;
    } else {
      value = valueOrEvent;
    }

    if (value === undefined || value === null) {
      value = "";
    }

    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetAll = useCallback(() => {
    setFilters({ ...initialFilters });
    setSortBy("");
    setSortOrder("asc");
    setPage(1);
    setPageSize(10);
  }, [initialFilters]);

  const setSort = useCallback((key: string) => {
    setSortBy((prev) => {
      if (prev === key) {
        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
        return prev;
      } else {
        setSortOrder("asc");
        return key;
      }
    });
  }, []);

  return {
    filters,
    sortBy,
    sortOrder,
    page,
    pageSize,

    setFilter,
    setSort,
    setPage,
    setPageSize,
    resetAll,
  };
};
