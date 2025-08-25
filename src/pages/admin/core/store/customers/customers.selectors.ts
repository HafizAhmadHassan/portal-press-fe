import { createSelector } from "@reduxjs/toolkit";
import { customersApi } from "@store_admin/customers/customers.api";
import type { CustomersQueryParams } from "@store_admin/customers/customers.types";

export const makeSelectCustomers = (params?: CustomersQueryParams) =>
  createSelector(
    customersApi.endpoints.getCustomers.select(params ?? {}),
    (res) => res?.data ?? []
  );

export const makeSelectCustomersStartsWith = (
  prefix: string,
  params?: CustomersQueryParams
) =>
  createSelector(makeSelectCustomers(params), (items) =>
    items.filter((s) => s.toLowerCase().startsWith(prefix.toLowerCase()))
  );

export const makeSelectCustomersIncludes = (
  term: string,
  params?: CustomersQueryParams
) =>
  createSelector(makeSelectCustomers(params), (items) =>
    items.filter((s) => s.toLowerCase().includes(term.toLowerCase()))
  );
