import React from "react";
import Modal from "@components/shared/modal/Modal";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import { Eye } from "lucide-react";

import styles from "./ModalTicketDetail.module.scss";

import TicketHeader from "./_components/TicketHeader/TicketHeader.component";
import SummaryCard from "./_components/SummaryCard/SummaryCard.component";
import DatesCard from "./_components/DatesCard/DatesCard.component";
import DescriptionsCard from "./_components/DescriptionsCard/DescriptionsCard.component";
import GuaranteeCard from "./_components/GuaranteeCard/GuaranteeCard.component";

import type {
  CloseTicketData,
  TicketWithDevice,
} from "../../_types/TicketWithDevice.types";

type Props = {
  ticket: CloseTicketData & TicketWithDevice;
};

export const ModalTicketDetails: React.FC<Props> = ({ ticket }) => {
  const openDescription = ticket?.open_Description;

  const closeDescription = ticket?.close_Description;

  const guaranteeList: string[] = ticket?.guanratee_status;

  return (
    <Modal
      size="lg"
      triggerButton={
        <SimpleButton size="bare" color="primary" variant="ghost" icon={Eye} />
      }
      cancelText="Chiudi"
    >
      <div className={styles.modalContent}>
        <TicketHeader ticket={ticket} />

        <SummaryCard ticket={ticket} />

        <DatesCard ticket={ticket} />

        {!!openDescription && (
          <DescriptionsCard
            title="Descrizione Apertura"
            text={openDescription}
          />
        )}

        {!!closeDescription && (
          <DescriptionsCard
            title="Descrizione Chiusura"
            text={closeDescription}
          />
        )}

        {!!guaranteeList?.length && <GuaranteeCard items={guaranteeList} />}
      </div>
    </Modal>
  );
};

export default ModalTicketDetails;
