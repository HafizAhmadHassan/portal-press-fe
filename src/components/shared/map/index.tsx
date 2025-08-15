// src/shared/map/Map.tsx (o dove risiede il componente esportato da @shared/map)
import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L, { type LatLngExpression } from 'leaflet';

import MapFiltersPanel from './MapFiltersPanel';
import NoDataOverlay from './NoDataOverlay';
import UserLocationMarker from './UserLocationMarker';
import ClusterLayer from './ClusterLayer';
import MapSearchInput from './MapSearchInput';

import type { MapDataItem } from './types/Map.types';
import wrapperStyles from './styles/MapWrapper.module.scss';
import containerStyles from './styles/MapContainer.module.scss';

import { useUi } from '@store_admin/ui/useUi'; // ← tema

interface MapProps {
  center: LatLngExpression;
  zoom?: number;
  height?: string;
  data?: MapDataItem[];
  showClustering?: boolean;
  clusterRadius?: number;
  activeIconUrl?: string;
  inactiveIconUrl?: string;
  renderPopup?: (item: MapDataItem) => string;
  isCollapsed?: boolean;
  showActions?: boolean;
}

const Map = ({
  center,
  zoom = 13,
  height = '400px',
  data = [],
  showClustering = false,
  clusterRadius = 50,
  activeIconUrl,
  inactiveIconUrl,
  renderPopup,
  isCollapsed = false,
  showActions = true,
}: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const [showActive, setShowActive] = useState(true);
  const [showInactive, setShowInactive] = useState(true);
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null);

  const { isDark } = useUi(); // ← stato tema

  const filteredData = data.filter(
    (d) => (showActive && d.activeStatus) || (showInactive && !d.activeStatus)
  );

  useEffect(() => {
    if (mapRef.current) {
      // Aggiorna misure dopo toggle pannelli o tema
      setTimeout(() => mapRef.current?.invalidateSize(), 200);
    }
  }, [isCollapsed, data, isDark]);

  const handleLocate = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: LatLngExpression = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        if (mapRef.current) {
          mapRef.current.flyTo(coords, 14, { animate: true, duration: 1.5, easeLinearity: 0.25 });
        }
      },
      (err) => {
        console.error('Errore geolocalizzazione:', err);
        alert('Non è stato possibile ottenere la tua posizione.\n\n' + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div
    className={`${wrapperStyles.mapWrapper} ${isDark ? wrapperStyles.mapWrapperDark : ''}`}
      style={{ height }}
    >
      {showActions && (
        <MapFiltersPanel
          showActive={showActive}
          showInactive={showInactive}
          toggleActive={() => setShowActive(!showActive)}
          toggleInactive={() => setShowInactive(!showInactive)}
          handleLocate={handleLocate}
        />
      )}

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        touchZoom
        zoomControl={false}
        attributionControl={false}
        className={containerStyles.mapContainer}
        style={{ height: '100%', width: '100%' }}
        ref={(m) => {
          if (m) mapRef.current = m;
        }}
      >
        {/* NB: il key forza il refresh dei tiles al cambio tema (facoltativo ma utile) */}
        <TileLayer
          key={isDark ? 'tiles-blue-dark' : 'tiles-light'}
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {showActions && <MapSearchInput initialCenter={center} initialZoom={zoom} />}

        {filteredData.length === 0 && <NoDataOverlay />}
        {userLocation && <UserLocationMarker position={userLocation} />}

        <ClusterLayer
          data={filteredData}
          showClustering={showClustering}
          clusterRadius={clusterRadius}
          activeIconUrl={activeIconUrl}
          inactiveIconUrl={inactiveIconUrl}
          renderPopup={renderPopup}
        />
      </MapContainer>
    </div>
  );
};

export default Map;
