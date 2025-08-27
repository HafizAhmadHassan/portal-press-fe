import React from "react";
import { getColorFromLetter } from "@utils/letter-colors.ts";
import type { User } from "@store_admin/users/user.types.ts";

export function Avatar({ user }: { user: User }) {
  return (
    <>
      {user.avatarUrl || user.avatar ? (
        <img
          src={user.avatarUrl || user.avatar}
          alt={user.fullName || user.username}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #e5e7eb",
          }}
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const placeholder = target.nextElementSibling as HTMLElement;
            if (placeholder) placeholder.style.display = "flex";
          }}
        />
      ) : null}
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          color: "#fff",
          background: getColorFromLetter(
            (user.fullName || user.username || "U").charAt(0).toUpperCase()
          ),
          display: user.avatarUrl || user.avatar ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "600",
          fontSize: "16px",
        }}
      >
        {(user.fullName || user.username || "U").charAt(0).toUpperCase()}
      </div>
    </>
  );
}
