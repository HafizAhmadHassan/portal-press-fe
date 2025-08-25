import { useGetCustomersQuery } from "@store_admin/customers/customers.api";
import type { CustomersQueryParams } from "@store_admin/customers/customers.types";

export const useCustomers = (params?: CustomersQueryParams) => {
  const {
    data = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetCustomersQuery(params ?? {});

  return {
    customers: data, // string[]
    isLoading: isLoading || isFetching,
    error,
    refetch,
  };
};
