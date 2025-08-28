import { LucideType as LucideIcon } from "lucide-react";
import styles from "../styles/SideNavIcon.module.scss";

interface Props {
  icon?: typeof LucideIcon;
  level: number;
  collapsed?: boolean;
}

export function SideNavIcon({ icon: Icon, level, collapsed = false }: Props) {
  if (!Icon) return null;

  // In modalità collapsed, usa sempre icone grandi per il livello 0
  const size = collapsed && level === 0 ? 24 : level === 0 ? 20 : 16;

  return <Icon size={size} className={styles.icon} />;
}
