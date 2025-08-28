import type { Device } from "@store_admin/devices/devices.types.ts";

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Mai";
  const date = new Date(dateString);
  return date.toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getRelativeTime = (dateString: string | null | undefined) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffInDays === 0) return "Oggi";
  if (diffInDays === 1) return "Ieri";
  if (diffInDays < 7) return `${diffInDays} giorni fa`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} settimane fa`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} mesi fa`;
  return `${Math.floor(diffInDays / 365)} anni fa`;
};

export const formatCoordinates = (x?: string | null, y?: string | null) => {
  if (!x || !y) return "N/A";
  const lat = parseFloat(y);
  const lng = parseFloat(x);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return "Non valide";
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

export const getFullAddress = (d?: Device) => {
  const parts = [d?.street || d?.address, d?.city, d?.province].filter(Boolean);
  return parts.length ? parts.join(", ") : "Indirizzo non disponibile";
};
