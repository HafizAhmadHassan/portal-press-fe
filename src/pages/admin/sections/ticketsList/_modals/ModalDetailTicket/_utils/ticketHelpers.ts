export const isClosed = (t: any) => Number(t?.status) === 2; // 1=open, 2=closed

export const formatDateTime = (dateString?: string) => {
  if (!dateString) return "N/D";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "N/D";
  return d.toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const relativeTime = (dateString?: string) => {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) return "Oggi";
  if (days === 1) return "Ieri";
  if (days < 7) return `${days} giorni fa`;
  if (days < 30) return `${Math.floor(days / 7)} settimane fa`;
  if (days < 365) return `${Math.floor(days / 30)} mesi fa`;
  return `${Math.floor(days / 365)} anni fa`;
};
