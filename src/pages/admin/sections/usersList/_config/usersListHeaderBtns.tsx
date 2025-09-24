import { Download, Plus, type LucideIcon } from "lucide-react";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component";
import { ModalCreateUpdateUser } from "../_modals/ModalCreateUpdateUser/ModalCreateUpdateUser.component";

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

const usersListHeaderBtns = (
  onRefreshClick: () => void,
  RefreshIcon: LucideIcon,
  isLoading: boolean,
  onExportClick: () => void
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
  {
    component: (
      <ModalCreateUpdateUser
        mode="create"
        triggerButton={
          <SimpleButton variant="outline" color="primary" size="sm" icon={Plus}>
            Nuovo
          </SimpleButton>
        }
      />
    ),
  },
  /*  {
    onClick: onExportClick,
    variant: "outline" as const,
    color: "success" as const,
    size: "sm" as const,
    icon: Download,
    label: "Esporta",
  }, */
];

export default usersListHeaderBtns;
