import React from "react";

import { Shield } from "lucide-react";
import { UserRoleLabels, UserRoles } from "@utils/constants/userRoles.ts";
import { CheckboxGroup } from "@components/shared/checkbox/CheckBox.component";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";

type Props = {
  permissions: string[];
  disabled?: boolean;
  onChange: (perms: string[]) => void;
};

export default function PermissionsCard({
  permissions,
  disabled,
  onChange,
}: Props) {
  const options = Object.values(UserRoles).map((role) => ({
    label: UserRoleLabels[role],
    value: role,
    description: `Permessi di ${UserRoleLabels[role].toLowerCase()}`,
  }));

  return (
    <DeviceCard title="Permessi Utente" icon={<Shield size={18} />}>
      <CheckboxGroup
        description="Seleziona i permessi da assegnare al nuovo utente"
        options={options}
        value={permissions}
        onChange={onChange}
        layout="grid"
        columns={2}
        disabled={disabled}
        color="primary"
      />
    </DeviceCard>
  );
}
