import type { User } from "@root/pages/admin/core/store/users/user.types";
import {
  UserRoleLabels,
  UserRoleStyles,
  UserRoles,
} from "@utils/constants/userRoles.ts";

// Fallback style per ruoli non mappati
const fallbackStyle = {
  backgroundColor: "#f3f4f6",
  color: "#374151",
  borderColor: "#d1d5db",
};

export const RoleBadge = ({
  user,
  customStyle,
}: {
  user: User;
  customStyle?: React.CSSProperties;
}) => {
  const roleKey = (user.role || "").toUpperCase().trim();
  const isKnownRole = (roleKey as keyof typeof UserRoles) in UserRoles;
  const style = isKnownRole
    ? UserRoleStyles[roleKey as keyof typeof UserRoleStyles] || fallbackStyle
    : fallbackStyle;
  const label = isKnownRole
    ? UserRoleLabels[roleKey as keyof typeof UserRoleLabels]
    : user.role || "Unknown";

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
        border: `1px solid ${style.borderColor}`,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        backgroundColor: style.backgroundColor,
        color: style.color,
        letterSpacing: 0.3,
        lineHeight: 1.1,
        textTransform: "none",
        ...customStyle,
      }}
      title={label}
    >
      {label}
    </span>
  );
};
