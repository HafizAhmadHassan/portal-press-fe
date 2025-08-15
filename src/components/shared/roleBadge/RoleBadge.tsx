import { UserRoleLabels } from '@utils/constants/userRoles.ts';
import React from 'react';

export const RoleBadge = ({ user }: { user: User }) => {
  const hardcodedStyles = {
    'DRIVER': { backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fca5a5' },
    'USER': { backgroundColor: '#dbeafe', color: '#1e40af', borderColor: '#60a5fa' },
    'ADVANCED_USER': { backgroundColor: '#d1fae5', color: '#065f46', borderColor: '#a7f3d0' },
    'ADMIN': { backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fcd34d' },
  };

  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {user.user_permissions.map((role, index) => {
        const style = hardcodedStyles[role as keyof typeof hardcodedStyles] || hardcodedStyles['USER'];

        return (
          <span
            key={`${role}-${index}`}
            style={{
              padding: '4px 8px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              border: `1px solid ${style.borderColor}`,
              display: 'inline-block',
              backgroundColor: style.backgroundColor,
              color: style.color,
            }}
          >
            {UserRoleLabels[role]}
          </span>
        );
      })}
    </div>
  );
};