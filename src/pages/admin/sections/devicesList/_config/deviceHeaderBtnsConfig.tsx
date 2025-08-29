import { Download, Grid, List, Map, Plus, type LucideIcon } from "lucide-react";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component";
import { ModalCreateDevice } from "@sections_admin/devicesList/_modals/ModalCreateDevice/ModalCreateDevice.component";
import type { Device } from "@store_admin/devices/devices.types";

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

const devicesListHeaderBtns = (
  onRefreshClick: () => void,
  RefreshIcon: LucideIcon,
  isLoading: boolean,
  onExportClick: () => void,
  toggleCardsTable: () => void,
  toggleMap: () => void,
  isCards: boolean,
  isMap: boolean,
  createNewDevice: (deviceData: Partial<Device>) => Promise<void>
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
      <ModalCreateDevice
        onSave={async (deviceData) => {
          if (!deviceData) {
            throw new Error("Device data is required");
          }
          await createNewDevice(deviceData);
        }}
        triggerButton={
          <SimpleButton variant="outline" color="primary" size="sm" icon={Plus}>
            Nuovo
          </SimpleButton>
        }
      />
    ),
  },
  {
    onClick: onExportClick,
    variant: "outline" as const,
    color: "success" as const,
    size: "sm" as const,
    icon: Download,
    label: "Esporta",
  },
  {
    onClick: toggleCardsTable,
    variant: "outline" as const,
    color: "primary" as const,
    size: "sm" as const,
    icon: isCards ? List : Grid,
    label: isCards ? "Tabella" : "Griglia",
  },
  {
    onClick: toggleMap,
    variant: "outline" as const,
    color: "primary" as const,
    size: "sm" as const,
    icon: Map,
    label: isMap ? "Lista" : "Mappa",
  },
];

export default devicesListHeaderBtns;
