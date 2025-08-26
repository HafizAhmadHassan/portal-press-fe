// @store_admin/scope/scope.selectors.ts
import type { RootState } from "@root/store";
export const selectScopedCustomer = (s: RootState) => s.scope.customer;
