import { Settings } from "lucide-react";
import { Input } from "@shared/inputs/Input.component.tsx";
import DeviceCard from "../../../../device/sections/_components/DeviceCard/DeviceCard.component";

type Props = {
  note: string;
  isSaving: boolean;
  onChange: (value: string) => void;
};

export default function NotesFormCard({ note, isSaving, onChange }: Props) {
  return (
    <DeviceCard title="Note" icon={<Settings size={18} />}>
      <Input
        label="Note aggiuntive"
        name="note"
        value={note}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Inserisci note aggiuntive sul dispositivo..."
        multiline
        disabled={isSaving}
      />
    </DeviceCard>
  );
}
