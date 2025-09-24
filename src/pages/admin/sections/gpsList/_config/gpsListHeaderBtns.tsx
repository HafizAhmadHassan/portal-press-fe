import { Download, Plus, type LucideIcon } from "lucide-react";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component";
import type { GpsDevice } from "@store_admin/gps/gps.types";
import ModalCreateUpdateGps from "../_modals/ModalCreateUpdateGps/ModalCreateUpdateGps.component";

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

const gpsListHeaderBtns = (
  onRefreshClick: () => void,
  RefreshIcon: LucideIcon,
  isLoading: boolean,
  onExportClick: () => void,
  handleCreate: (data: Partial<GpsDevice>) => Promise<void> | void
): ActionItem[] => [
  {
    onClick: onRefreshClick,
    variant: "outline",
    color: "secondary",
    size: "sm",
    icon: RefreshIcon,
    label: "Aggiorna",
    disabled: isLoading,
  },
  {
    component: (
      <ModalCreateUpdateGps
        mode="create"
        onSave={handleCreate}
        triggerButton={
          <SimpleButton variant="outline" color="primary" size="sm" icon={Plus}>
            Nuovo
          </SimpleButton>
        }
      />
    ),
  },
  /* {
    onClick: onExportClick,
    variant: "outline",
    color: "success",
    size: "sm",
    icon: Download,
    label: "Esporta",
  }, */
];

export default gpsListHeaderBtns;
