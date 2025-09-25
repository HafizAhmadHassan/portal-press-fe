import { useMemo, useEffect } from "react";
import Map from "@shared/map";
import { createDevicePopup } from "@sections_admin/devicesList/utils/MapPopupBuilder";
import Pin1 from "@assets/images/kgn-pin.svg";
import Pin2 from "@assets/images/kgn-pin-red.png";
import { DeviceHelpers } from "@sections_admin/devicesList/utils/DeviceHelpers";
import type { Device } from "@store_admin/devices/devices.types";
import { useNavigate } from "react-router-dom";

interface Props {
  mapData: Device[];
  isCollapsed: boolean;
  center?: [number, number];
  mapHeight?: string;
  showActions?: boolean;
  zoom?: number;
}

const DevicesMap = ({
  mapData,
  isCollapsed,
  center,
  mapHeight,
  showActions = false,
  zoom = 6,
}: Props) => {
  const navigate = useNavigate();

  const data = useMemo(
    () => DeviceHelpers.transformDevicesToMapData(mapData),
    [mapData]
  );

  // Event delegation per gestire i click sui bottoni dei popup
  useEffect(() => {
    const handleDetailsClick = (event: Event) => {
      const target = event.target as HTMLElement;

      if (target.classList.contains("device-details-btn")) {
        const deviceId = target.getAttribute("data-device-id");

        if (deviceId) {
          navigate(`/device/${deviceId}`);
        }
      }
    };

    // Aggiungi l'event listener al documento
    document.addEventListener("click", handleDetailsClick);

    // Cleanup function
    return () => {
      document.removeEventListener("click", handleDetailsClick);
    };
  }, [navigate]);

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

export default DevicesMap;
