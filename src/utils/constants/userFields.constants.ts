// userFields.constants.ts - Solo costanti e types
export const UserFields = {
  EMAIL: "email",
  USERNAME: "username",
  USER_PERMISSIONS: "user_permissions",
  IS_ACTIVE: "is_active",
} as const;

export type UserFieldsType = (typeof UserFields)[keyof typeof UserFields];

// Types per i filtri - OPTIONAL fields
export type UsersFilters = Partial<Record<UserFieldsType, string>>;

// Type per la funzione setFilter
export type SetFilterFunction = <K extends UserFieldsType>(
  key: K,
  value: string | number
) => void;

// Props per la funzione di configurazione
export interface CreateUsersFilterConfigProps {
  filters: UsersFilters;
  setFilter: SetFilterFunction;
}
