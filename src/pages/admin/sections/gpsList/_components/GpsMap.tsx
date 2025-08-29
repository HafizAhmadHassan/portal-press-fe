import Map from "@shared/map";
import { useMemo } from "react";
import Pin1 from "@assets/images/kgn-pin.svg";
import Pin2 from "@assets/images/kgn-pin-red.png";
import type { Device } from "@store_admin/devices/devices.types";
import { DeviceHelpers } from "@sections_admin/devicesList/utils/DeviceHelpers";
import { createDevicePopup } from "@sections_admin/devicesList/utils/MapPopupBuilder";

interface Props {
  mapData: Device[];
  isCollapsed: boolean;
  center?: [number, number];
  mapHeight?: string;
  showActions?: boolean;
  zoom?: number;
}

const GpsMap = ({
  mapData,
  isCollapsed,
  center,
  mapHeight,
  showActions = false,
  zoom = 6,
}: Props) => {
  const data = useMemo(
    () => DeviceHelpers.transformDevicesToMapData(mapData),
    [mapData]
  );

  return (
    <Map
      showActions={showActions}
      height={mapHeight || "77vh"}
      zoom={zoom}
      center={center || [42.5, 12]}
      data={data}
      showClustering
      clusterRadius={50}
      activeIconUrl={Pin1}
      inactiveIconUrl={Pin2}
      renderPopup={(item) => createDevicePopup(item?.additionalData)}
      isCollapsed={isCollapsed}
    />
  );
};

export default GpsMap;
