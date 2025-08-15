export interface MapDataItem {
    id: string | number;
    name: string;
    latitude: number;
    longitude: number;
    activeStatus: boolean;
    popupContent?: string;
    additionalData?: any;
}

export interface KgnMapProps {
    center?: [number, number];
    zoom?: number;
    height?: string;
    data?: MapDataItem[];
    activeIconUrl?: string;
    inactiveIconUrl?: string;
    showClustering?: boolean;
    clusterRadius?: number;
}