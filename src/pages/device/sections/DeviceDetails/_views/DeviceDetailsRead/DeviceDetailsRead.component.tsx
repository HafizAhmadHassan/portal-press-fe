import type { Device } from "@store_admin/devices/devices.types.ts";

// sezioni read-only già esistenti
import Summary from "@root/pages/_commons/DevicesDetails/view/Summary/Summary.component";
import NoteInfo from "@root/pages/_commons/DevicesDetails/view/NoteInfo/NoteInfo.component";
import PositionInfoRO from "@root/pages/_commons/DevicesDetails/view/PositionInfo/PositionInfo.component";
import RegisterInfoRO from "@root/pages/_commons/DevicesDetails/view/RegisterInfo/RegisterInfo.component";
import TechnicalInfoRO from "@root/pages/_commons/DevicesDetails/view/TechnicalInfo/TechnicalInfo.component";
import DateHoursInfoRO from "@root/pages/_commons/DevicesDetails/view/DateHoursInfo/DateHoursInfo.component";
import CoordinatesInfoRO from "@root/pages/_commons/DevicesDetails/view/CoordinatesInfo/CoordinatesInfo.component";

import styles from "./DeviceDetailsRead.module.scss";
import {
  formatCoordinates,
  formatDate,
  getRelativeTime,
} from "../../_utils/details.utils";

type Props = { device?: Device | null };

export default function DeviceDetailsRead({ device }: Props) {
  if (!device) return null;

  return (
    <div className={styles.readStack}>
      <TechnicalInfoRO device={device} />
      <PositionInfoRO device={device} />
      <DateHoursInfoRO
        device={device}
        formatDate={formatDate}
        getRelativeTime={getRelativeTime}
      />
      <CoordinatesInfoRO
        device={device}
        formatCoordinates={formatCoordinates}
      />
      <RegisterInfoRO device={device} />
      {device?.note && <NoteInfo device={device} />}
      <Summary device={device} />
    </div>
  );
}
