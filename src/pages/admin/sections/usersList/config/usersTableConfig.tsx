import type { User } from "@store_admin/users/user.types";
import { ModalDeleteConfirm } from "@sections_admin/usersList/_modals/ModalDeleteConfirm.component";
import { RoleBadge } from "@shared/roleBadge/RoleBadge";
import type { TableColumn } from "@components/shared/table/types/GenericTable.types";
import ModalDetails from "../_modals/ModalDetails/ModalDetails.component";
import { ModalCreateUpdateUser } from "../_modals/ModalCreateUpdateUser/ModalCreateUpdateUser.component";

interface UsersColumnsProps {
  onEdit: (userData: Partial<User> & { id: number | string }) => Promise<void>;
  onDelete: (user: User) => Promise<void>;
}

export const getUsersColumns = ({
  onEdit,
  onDelete,
}: UsersColumnsProps): Array<TableColumn<User>> => {
  const tPrimary = "var(--text-primary)";
  const tSecondary = "var(--text-secondary)";

  return [
    {
      key: "display_name",
      header: "Utente",
      type: "avatar",
      width: "280px",
      sortable: true,
      avatarConfig: {
        nameField: "display_name",
        emailField: "email",
        avatarField: "profile.avatar_url", // Supporta dot notation
        size: "md",
        nameTextConfig: {
          overflow: "ellipsis",
          maxWidth: "200px",
          showTooltip: true,
        },
        emailTextConfig: {
          overflow: "ellipsis",
          maxWidth: "200px",
          showTooltip: true,
        },
      },
      // Custom accessor per il nome display
      accessor: (user: User) => {
        return (
          user.fullName ||
          (user.firstName || user.lastName
            ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
            : user.username || "N/A")
        );
      },
    },
    {
      key: "username",
      header: "Username",
      type: "text",
      width: "150px",
      sortable: true,
      textConfig: {
        overflow: "ellipsis",
        maxWidth: "130px",
        showTooltip: true,
      },
      accessor: (user: User) => user.username || "N/A",
    },
    {
      key: "role",
      header: "Ruolo",
      type: "custom",
      width: "180px",
      sortable: true,
      render: (_v, user) => <RoleBadge user={user} />,
    },
    {
      key: "is_active",
      header: "Stato",
      type: "boolean",
      width: "120px",
      sortable: true,
      booleanConfig: {
        trueLabel: "Attivo",
        falseLabel: "Inattivo",
      },
    },
    {
      key: "date_joined",
      header: "Data Creazione",
      type: "custom",
      width: "160px",
      sortable: true,
      render: (_v, user) => {
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
      type: "custom",
      width: "130px",
      render: (_v, user) => (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <ModalDetails user={user} />
          <ModalCreateUpdateUser
            mode="edit"
            initialUser={user}
            onSave={(partial) => onEdit({ ...partial, id: user.id })}
          />
          <ModalDeleteConfirm user={user} onConfirm={() => onDelete(user)} />
        </div>
      ),
    },
  ];
};
