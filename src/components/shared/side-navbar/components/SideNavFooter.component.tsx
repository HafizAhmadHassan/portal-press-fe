import React from 'react';
import styles from '../styles/SideNavFooter.module.scss';
import { SideNavUserProfile } from './SideNavUserProfile.component';
import { useSession } from '@store_admin/auth/hooks/useSession.ts';

interface Props {
    customFooter?: React.ReactNode;
}

export function SideNavFooter({

                                  customFooter
                              }: Props) {
    if (customFooter) {
        return <div className={styles.customFooter}>{customFooter}</div>;
    }
  const { user, isAuthenticated } = useSession();

    if (!isAuthenticated) return null;
    return (
      <div className={styles.footer}>
          <SideNavUserProfile user={user} />
      </div>
    );
}