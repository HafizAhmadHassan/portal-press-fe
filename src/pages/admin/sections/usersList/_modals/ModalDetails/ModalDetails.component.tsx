import React from "react";
import Modal from "@components/shared/modal/Modal";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import { Eye } from "lucide-react";
import type { User } from "@store_admin/users/user.types";

import styles from "./ModalDetails.module.scss";
import UserHeader from "./_components/UserHeader/UserHeader.component";
import PersonalInfoCard from "./_components/PersonalInfoCard/PersonalInfoCard.component";
import AccountInfoCard from "./_components/AccountInfoCard/AccountInfoCard.component";
import DatesCard from "./_components/DatesCard/DatesCard.component";
import PermissionsCard from "./_components/PermissionsCard/PermissionsCard.component";
import GroupsCard from "./_components/GroupsCard/GroupsCard.component";
import PrivilegesSummaryCard from "./_components/PrivilegesSummaryCard/PrivilegesSummaryCard.component";

// sub-components

interface ModalDetailsProps {
  user: User;
}

export const ModalDetails: React.FC<ModalDetailsProps> = ({ user }) => {
  return (
    <Modal
      size="lg"
      triggerButton={
        <SimpleButton size="bare" color="primary" variant="ghost" icon={Eye} />
      }
      cancelText="Chiudi"
    >
      <div className={styles.modalContent}>
        <UserHeader user={user} />

        <PersonalInfoCard user={user} />

        <AccountInfoCard user={user} />

        <DatesCard user={user} />

        <PermissionsCard user={user} />

        {!!user.groups?.length && <GroupsCard user={user} />}

        <PrivilegesSummaryCard user={user} />
      </div>
    </Modal>
  );
};

export default ModalDetails;
