import React from "react";
import type { User } from "@store_admin/users/user.types";
import { ModalEditComponent } from "@sections_admin/usersList/_modals/ModalEdit.component";
import { ModalDeleteConfirm } from "@sections_admin/usersList/_modals/ModalDeleteConfirm.component";
import { ModalDetails } from "@sections_admin/usersList/_modals/ModalDetails.component";
import { Avatar } from "@shared/avatar/Avatar.compoent.tsx";
import { RoleBadge } from "@shared/roleBadge/RoleBadge.tsx";

interface UsersTableConfigProps {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isLoading?: boolean;
}

export const createUsersTableConfig = ({
  users,
  onView,
  onEdit,
  onDelete,
  isLoading = false,
}: UsersTableConfigProps) => {
  const tPrimary = "var(--text-primary)";
  const tSecondary = "var(--text-secondary)";

  return {
    columns: [
      {
        key: "fullName",
        header: "Utente",
        type: "custom" as const,
        width: "280px",
        sortable: true,
        render: (_: any, user: User) => (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Avatar user={user} />
            <div>
              <div
                style={{ fontWeight: 600, fontSize: "14px", color: tPrimary }}
              >
                {user.fullName ||
                  `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                  user.username}
              </div>
              {user.email && (
                <div style={{ fontSize: "12px", color: tSecondary }}>
                  {user.email}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        key: "username",
        header: "Username",
        type: "text" as const,
        width: "150px",
        sortable: true,
      },
      {
        key: "groups",
        header: "Ruolo",
        type: "custom" as const,
        width: "180px",
        sortable: true,
        render: (_: any, user: User) => <RoleBadge user={user} />,
      },
      {
        key: "isActive",
        header: "Stato",
        type: "badge" as const,
        width: "120px",
        sortable: true,
        badgeConfig: {
          true: { label: "Attivo", className: "success" },
          false: { label: "Inattivo", className: "danger" },
        },
        accessor: (u: User) => Boolean(u.isActive),
      },
      {
        key: "dateJoined",
        header: "Data Creazione",
        type: "custom" as const,
        width: "160px",
        sortable: true,
        render: (_: any, user: User) => {
          if (!user.dateJoined)
            return <span style={{ color: tSecondary }}>N/A</span>;
          const date = new Date(user.dateJoined);
          return (
            <div>
              <div style={{ fontSize: "14px", color: tPrimary }}>
                {date.toLocaleDateString("it-IT")}
              </div>
              <div style={{ fontSize: "12px", color: tSecondary }}>
                {date.toLocaleTimeString("it-IT", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        },
      },
      {
        key: "actions",
        header: "Azioni",
        type: "custom" as const,
        width: "130px",
        render: (_: any, user: User) => (
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "center" }}
          >
            <ModalDetails user={user} />
            <ModalEditComponent user={user} onSave={onEdit} />
            <ModalDeleteConfirm user={user} onConfirm={onDelete} />
          </div>
        ),
      },
    ],
    data: users,
    loading: isLoading,
    pagination: {
      enabled: true,
      pageSize: 10,
      currentPage: 1,
    },
    sorting: {
      enabled: true,
      defaultSort: { key: "dateJoined", direction: "desc" as const },
    },
    selection: {
      enabled: false,
      selectedItems: [],
      idField: "id",
    },
    emptyMessage:
      "Nessun utente trovato. Prova a modificare i filtri di ricerca.",
    className: "users-table",
  };
};
