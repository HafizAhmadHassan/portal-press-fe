import type { LucideIcon } from "lucide-react";

type ButtonConfig = {
  onClick: () => void;
  variant?: "filled" | "outline";
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  label: string;
  disabled?: boolean;
};

type ComponentConfig = {
  component: React.ReactNode;
};

type ActionItem = ButtonConfig | ComponentConfig;

const logsListHeaderBtns = (
  onRefreshClick: () => void,
  RefreshIcon: LucideIcon,
  isLoading: boolean,
  onExportClick: () => void,
  ExportIcon: LucideIcon
): ActionItem[] => [
  {
    onClick: onRefreshClick,
    variant: "outline" as const,
    color: "secondary" as const,
    size: "sm" as const,
    icon: RefreshIcon,
    label: "Aggiorna",
    disabled: isLoading,
  },
  /* {
    onClick: onExportClick,
    variant: "outline" as const,
    color: "success" as const,
    size: "sm" as const,
    icon: ExportIcon,
    label: "Esporta",
  }, */
];

export default logsListHeaderBtns;
