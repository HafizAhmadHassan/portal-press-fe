import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import type { MapDataItem } from "./types/Map.types";
import { createCustomIcon, getClusterIcon } from "./utils";
import "./styles/ClusterIcon.module.scss"; // Needed for custom-cluster-icon

interface Props {
  data: MapDataItem[];
  showClustering: boolean;
  clusterRadius: number;
  activeIconUrl?: string;
  inactiveIconUrl?: string;
  renderPopup?: (item: MapDataItem) => string;
}

const ClusterLayer = ({
  data,
  showClustering,
  clusterRadius,
  activeIconUrl,
  inactiveIconUrl,
  renderPopup,
}: Props) => {
  const map = useMap();
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
        clusterGroupRef.current = null;
      }
      markersRef.current.forEach((marker) => map.removeLayer(marker));
      markersRef.current = [];
      return;
    }

    if (clusterGroupRef.current) map.removeLayer(clusterGroupRef.current);
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

    const iconForItem = (item: MapDataItem) =>
      item?.activeStatus && activeIconUrl
        ? createCustomIcon(activeIconUrl, true)
        : !item?.activeStatus && inactiveIconUrl
        ? createCustomIcon(inactiveIconUrl, false)
        : new L.Icon.Default();

    if (showClustering) {
      clusterGroupRef.current = (L as any).markerClusterGroup({
        maxClusterRadius: clusterRadius,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: (cluster) => getClusterIcon(cluster, data),
      });

      data.forEach((item) => {
        const marker = L.marker([item?.gps_x, item?.gps_y], {
          icon: iconForItem(item),
        });
        marker.bindPopup(renderPopup?.(item) ?? defaultPopup(item));
        clusterGroupRef.current!.addLayer(marker);
      });

      map.addLayer(clusterGroupRef.current);
    } else {
      data.forEach((item) => {
        const marker = L.marker([item?.gps_x, item?.gps_y], {
          icon: iconForItem(item),
        });
        marker.bindPopup(renderPopup?.(item) ?? defaultPopup(item));
        marker.addTo(map);
        markersRef.current.push(marker);
      });
    }

    return () => {
      if (clusterGroupRef.current) map.removeLayer(clusterGroupRef.current);
      markersRef.current.forEach((marker) => map.removeLayer(marker));
    };
  }, [
    data,
    showClustering,
    clusterRadius,
    map,
    activeIconUrl,
    inactiveIconUrl,
    renderPopup,
  ]);

  const defaultPopup = (item: MapDataItem) => `
    <div class="device-popup">
      <strong>${item?.name}</strong><br/>
      <small>Lat: ${item?.gps_x}</small><br/>
      <small>Lng: ${item?.gps_y}</small><br/>
      <small>Status: ${item?.activeStatus ? "Attivo" : "Inattivo"}</small>
    </div>`;

  return null;
};

export default ClusterLayer;
