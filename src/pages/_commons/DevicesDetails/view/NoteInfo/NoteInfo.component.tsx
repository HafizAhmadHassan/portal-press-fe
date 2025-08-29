import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import stylesNote from "./NoteInfo.module.scss";
import { Settings } from "lucide-react";

export default function NoteInfo({ device }: { device: any }) {
  return (
    <DeviceCard title="Note" icon={<Settings />}>
      <div className={stylesNote.notesContainer}>
        <p className={stylesNote.notesText}>{device?.note}</p>
      </div>
    </DeviceCard>
  );
}
