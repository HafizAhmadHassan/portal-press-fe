import type { User } from "@root/pages/admin/core/store/users/user.types";
import styles from "../styles/SideNavAvatar.module.scss";
import { Avatar } from "@shared/avatar/Avatar.compoent.tsx";

export function SideNavAvatar({ user }: { user: User }) {
  return (
    <div className={styles.avatar}>
      <Avatar user={user} />
    </div>
  );
}
