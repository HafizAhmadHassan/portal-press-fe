export const UserRoles = {
  USER: "USER",
  ADMIN: "ADMIN",
  DRIVER: "DRIVER", // elenco delle macchine e gli allarmi
  SUPER_ADMIN: "SUPER_ADMIN",
  ADVANCED_USER: "ADVANCED_USER",
} as const;

export const UserRolesGroups = {
  "1": UserRoles.USER,
  "2": UserRoles.DRIVER,
  "3": UserRoles.ADMIN,
  "4": UserRoles.SUPER_ADMIN,
  "5": UserRoles.ADVANCED_USER,
};

export type UserRoles = (typeof UserRoles)[keyof typeof UserRoles];

export const UserRoleLabels: Record<UserRoles, string> = {
  [UserRoles.ADMIN]: "Admin",
  [UserRoles.SUPER_ADMIN]: "Super Admin",
  [UserRoles.USER]: "User",
  [UserRoles.ADVANCED_USER]: "Advanced User",
  [UserRoles.DRIVER]: "Driver",
};
export const UserRoleGroupsLabels: Record<
  keyof typeof UserRolesGroups,
  string
> = {
  "1": "User",
  "2": "Driver",
  "3": "Admin",
  "4": "Super Admin",
  "5": "Advanced User",
};

export const UserRoleStyles: Record<
  UserRoles,
  { backgroundColor: string; color: string; borderColor: string }
> = {
  [UserRoles.SUPER_ADMIN]: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
    borderColor: "#fcd34d",
  },
  [UserRoles.ADMIN]: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    borderColor: "#60a5fa",
  },
  [UserRoles.USER]: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
    borderColor: "#d1d5db",
  },
  [UserRoles.ADVANCED_USER]: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
    borderColor: "#d1d5db",
  },
  [UserRoles.DRIVER]: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
    borderColor: "#d1d5db",
  },
};
