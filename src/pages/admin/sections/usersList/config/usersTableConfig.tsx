// config/usersTableConfig.ts
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

// Definizione del tipo delle colonne includendo chiavi virtuali
type UserColumnKey = keyof User | "display_name" | "actions";

export const getUsersColumns = ({
  onEdit,
  onDelete,
}: UsersColumnsProps): Array<TableColumn<User, UserColumnKey>> => {
  const tPrimary = "var(--text-primary)";
  const tSecondary = "var(--text-secondary)";

  return [
    // Colonna Utente - custom per avere controllo completo
    {
      key: "full_name",
      header: "Utente",
      type: "custom",
      width: "280px",
      sortable: true,
      render: (_value, user) => {
        const displayName =
          user.full_name ||
          (user.first_name || user.last_name
            ? `${user.first_name} ${user.last_name}`.trim()
            : user.username || "N/A");

        const avatarLetter = displayName.charAt(0).toUpperCase();

        return (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Avatar */}
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={displayName}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "var(--primary-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "16px",
                }}
              >
                {avatarLetter}
              </div>
            )}

            {/* Info utente */}
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "var(--text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "180px",
                }}
                title={displayName}
              >
                {displayName}
              </div>
              {user.email && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "180px",
                  }}
                  title={user.email}
                >
                  {user.email}
                </div>
              )}
            </div>
          </div>
        );
      },
    },

    // Colonna Username
    {
      key: "username",
      header: "Username",
      type: "text",
      width: "150px",
      sortable: true,
    },

    // Colonna Ruolo
    {
      key: "role",
      header: "Ruolo",
      type: "custom",
      width: "180px",
      sortable: true,
      render: (_v, user) => <RoleBadge user={user} />,
    },

    // Colonna Stato
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

    // Colonna Data Creazione
    {
      key: "date_joined",
      header: "Data Creazione",
      type: "custom",
      width: "160px",
      sortable: true,
      render: (_v, user) => {
        if (!user.date_joined)
          return <span style={{ color: tSecondary }}>N/A</span>;
        const date = new Date(user.date_joined);
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

    // Colonna Azioni
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
