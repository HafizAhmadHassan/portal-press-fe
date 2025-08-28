import type { User } from "@root/pages/admin/core/store/users/user.types";
import { UserRoleGroupsLabels } from "@utils/constants/userRoles.ts";

export const RoleBadge = ({ user }: { user: User }) => {
  const hardcodedStyles = {
    1: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
      borderColor: "#60a5fa",
    },
    2: {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      borderColor: "#fca5a5",
    },
    3: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
      borderColor: "#fcd34d",
    },
    ADVANCED_USER: {
      backgroundColor: "#d1fae5",
      color: "#065f46",
      borderColor: "#a7f3d0",
    },
  };

  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {user?.groups?.map((role, index) => {
        const style =
          hardcodedStyles[role as keyof typeof hardcodedStyles] ||
          hardcodedStyles[1];

        // Ensure role is a string and matches the keys of UserRoleGroupsLabels
        const roleKey = String(role) as keyof typeof UserRoleGroupsLabels;

        return (
          <span
            key={`${role}-${index}`}
            style={{
              padding: "4px 8px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              border: `1px solid ${style.borderColor}`,
              display: "inline-block",
              backgroundColor: style.backgroundColor,
              color: style.color,
            }}
          >
            {UserRoleGroupsLabels[roleKey]}
          </span>
        );
      })}
    </div>
  );
};
