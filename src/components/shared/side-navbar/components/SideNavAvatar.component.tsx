import React from 'react';
import { User } from 'lucide-react';
import styles from '../styles/SideNavAvatar.module.scss';
import { Avatar } from '@shared/avatar/Avatar.compoent.tsx';


export function SideNavAvatar({ user }: User) {
    return (
        <div className={styles.avatar}>
          <Avatar user={user}/>
        </div>
    );
}