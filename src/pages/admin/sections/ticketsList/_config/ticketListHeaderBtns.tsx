import { type LucideIcon } from "lucide-react";

// Import the types from SectionHeader
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

const ticketListHeaderBtns = (
  onRefreshClick: () => void,
  RefreshIcon: LucideIcon,
  isLoading: boolean
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
];

export default ticketListHeaderBtns;
