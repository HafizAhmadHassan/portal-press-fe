import { apiSlice } from "@store_admin/apiSlice";
import type {
  CustomerName,
  CustomersQueryParams,
  CustomersWrappedResponse,
} from "./customers.types";

export const customersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<CustomerName[], CustomersQueryParams | void>({
      query: (params = {}) => {
        const cleanParams = Object.entries(
          params as Record<string, unknown>
        ).reduce((acc, [key, value]) => {
          if (
            typeof value === "boolean" ||
            (value !== undefined && value !== null && value !== "")
          ) {
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, unknown>);

        return {
          url: "customers/", // relativo a baseUrl del tuo apiSlice
          params: cleanParams,
        };
      },
      providesTags: [{ type: "LIST" as const, id: "Customers" }],
      transformResponse: (response: unknown) => {
        // Supporta:
        // 1) string[]
        // 2) [{ customers: string[] }]
        // 3) { customers: string[] }
        let raw: unknown[] = [];

        if (Array.isArray(response)) {
          if (response.every((v) => typeof v === "string")) {
            raw = response as unknown[];
          } else {
            // es: [{ customers: [...] }]
            const wrapped = response as CustomersWrappedResponse;
            raw = wrapped.flatMap((item) =>
              Array.isArray(item?.customers)
                ? (item.customers as unknown[])
                : []
            );
          }
        } else if (
          response &&
          typeof response === "object" &&
          Array.isArray((response as any).customers)
        ) {
          raw = (response as any).customers as unknown[];
        }

        // Normalizza: tieni solo stringhe, trim, rimuovi vuoti, dedup case-insensitive
        const seen = new Set<string>();
        const cleaned: string[] = [];
        for (const v of raw) {
          if (typeof v !== "string") continue;
          const s = v.trim();
          if (!s) continue;
          const key = s.toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            cleaned.push(s);
          }
        }

        return cleaned as CustomerName[];
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetCustomersQuery } = customersApi;
