import React from "react";
import { EyeIcon, PowerIcon, SpoolIcon } from "lucide-react";
import { SimpleButton } from "@root/components/shared/simple-btn/SimpleButton.component";
import { ModalRiActiveDevice } from "@sections_admin/devicesList/_modals/ModalRiActivateDevice/ModalRiActiveDevice.component";

import styles from "./DevicesBoxFooter.module.scss";
import type { Device } from "@store_admin/devices/devices.types";
import type { MessageCreate } from "@store_admin/tickets/ticket.types";
import ModalOpenTicket from "@root/pages/admin/sections/ticketsList/_modals/ModalsOpenTicket/ModalOpenTicket.component";

interface DevicesBoxFooterProps {
  device: Device;
  isActive: boolean;
  isCreating: boolean;
  onGoToPLC: () => void;
  onTicketSave: (ticketData: MessageCreate) => Promise<void>;
}

export const DevicesBoxFooter: React.FC<DevicesBoxFooterProps> = ({
  device,
  isActive,
  isCreating,
  onGoToPLC,
  onTicketSave,
}) => {
  return (
    <div className={styles.footer}>
      {!isActive && (
        <ModalRiActiveDevice
          device={device}
          triggerButton={
            <SimpleButton variant="filled" color="error" size="sm">
              <PowerIcon size={12} />
            </SimpleButton>
          }
        />
      )}

      <SimpleButton
        size="sm"
        variant="filled"
        type="button"
        color="primary"
        onClick={onGoToPLC}
      >
        <EyeIcon size={12} />
      </SimpleButton>

      <ModalOpenTicket
        device={device}
        onSave={onTicketSave}
        triggerButton={
          <SimpleButton
            variant="filled"
            size="sm"
            color="warning"
            disabled={isCreating}
          >
            <SpoolIcon size={12} />
          </SimpleButton>
        }
      />
    </div>
  );
};
