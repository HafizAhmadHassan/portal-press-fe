import { Marker } from 'react-leaflet';
import L from 'leaflet';
import { Home } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import styles from './styles/UserLocationMarker.module.scss'

interface Props {
    position: L.LatLngExpression;
}

const UserLocationMarker = ({ position }: Props) => {
    const userIcon = L.divIcon({
        className: styles.customUserIcon,
        html: renderToStaticMarkup(<Home size={24} color="#3b82f6" />),
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });

    return <Marker position={position} icon={userIcon} />;
};

export default UserLocationMarker;
