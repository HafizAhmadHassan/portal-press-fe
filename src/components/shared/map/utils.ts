import L from "leaflet";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import type { MapDataItem } from "./types/Map.types";

export const createCustomIcon = (iconUrl: string, isActive: boolean) =>
  new L.Icon({
    iconUrl,
    iconSize: [32, 37],
    iconAnchor: [16, 37],
    popupAnchor: [0, -37],
    shadowUrl: markerShadow,
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
    className: isActive ? "marker-active" : "marker-inactive",
  });

export const getClusterIcon = (cluster: any, data: MapDataItem[]) => {
  const count = cluster.getChildCount();
  const size = count > 50 ? "large" : count > 10 ? "medium" : "small";
  const hasInactive = cluster.getAllChildMarkers().some((m: any) => {
    const { lat, lng } = m.getLatLng();
    return data.some(
      (item) =>
        Math.abs(item?.gps_x - lat) < 0.0001 &&
        Math.abs(item?.gps_y - lng) < 0.0001 &&
        !item?.activeStatus
    );
  });
  const color = hasInactive ? "#FF9800" : "#4CAF50";

  return new L.DivIcon({
    html: `<div class="cluster-inner" style="
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      background-color: ${color};
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.8);
    ">${count}</div>`,
    className: `custom-cluster-icon cluster-${size} cluster-${
      hasInactive ? "warning" : "normal"
    }`,
    iconSize:
      size === "small" ? [30, 30] : size === "medium" ? [40, 40] : [50, 50],
  });
};
