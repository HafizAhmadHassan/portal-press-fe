import type { FilterConfig } from "@utils/types/filters.types.ts";
import { UserRoleLabels, UserRoles } from "@utils/constants/userRoles.ts";
// Importa UserFields dal file corretto
// import { UserFields } from '@utils/constants/userFields.ts'; // se esiste già
// OPPURE definiscilo qui se non esiste:

export const UserFields = {
  EMAIL: "email",
  USERNAME: "username",
  USER_PERMISSIONS: "userPermissions",
  isActive: "isActive",
};

export const createUsersFilterConfig = ({
  filters,
  setFilter,
}): FilterConfig[] => [
  {
    key: UserFields.EMAIL,
    type: "text", // cambiato da 'email' a 'text' per compatibilità
    label: "Email",
    name: UserFields.EMAIL,
    placeholder: "Inserisci email",
    value: filters[UserFields.EMAIL] || "", // usa la costante come chiave
    onChange: (e: any) => setFilter(UserFields.EMAIL, e.target?.value || e),
  },
  {
    key: UserFields.USERNAME,
    type: "text",
    label: "Username",
    name: UserFields.USERNAME,
    placeholder: "Inserisci username",
    value: filters[UserFields.USERNAME] || "", // usa la costante come chiave
    onChange: (e: any) => setFilter(UserFields.USERNAME, e.target?.value || e),
  },
  {
    key: UserFields.USER_PERMISSIONS,
    type: "select",
    label: "Ruolo",
    name: UserFields.USER_PERMISSIONS,
    placeholder: "Seleziona ruolo",
    value: filters[UserFields.USER_PERMISSIONS] || "", // usa la costante come chiave
    onChange: (value) => setFilter(UserFields.USER_PERMISSIONS, value),
    options: [
      { label: "Tutti i ruoli", value: "" }, // opzione per resettare il filtro
      ...Object.values(UserRoles).map((role) => ({
        label: UserRoleLabels[role],
        value: role,
      })),
    ],
  },
  {
    key: UserFields.isActive,
    type: "select",
    label: "Stato",
    name: UserFields.isActive,
    placeholder: "Tutti",
    value: filters[UserFields.isActive] || "", // usa la costante come chiave
    onChange: (value) => setFilter(UserFields.isActive, value),
    options: [
      { label: "Tutti", value: "" }, // opzione per resettare il filtro
      { label: "Attivo", value: "true" },
      { label: "Disattivo", value: "false" },
    ],
  },
];
