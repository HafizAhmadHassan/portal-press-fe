export const MachineCardConfig: any = {
  direction: "horizontal",
  size: "md",
  variant: "elevated",
  maxWidth: "520px",
  status: {
    field: "status_Machine_Blocked",
    activeValue: true,
    showIndicator: true,
    animation: "pulse",
    labels: {
      active: "ATTIVO",
      inactive: "NON ATTIVO",
    },
  },
  image: {
    fallbackUrl:
      "https://public-assets.ayayot.com/4081-0733-7005-8389-2939/38/e5/9c8102cb24c5ba8f5ae5e12216abffde7b947fb036e70808a4b091f80c98c57cd21d5548e3da8767fd3bcab35c0bbddc57f6683cd790e55269a3097ef8d3.png",
    size: "md",
    position: "left",
    showStatus: true,
    aspectRatio: "3/2",
  },
  fields: [
    {
      key: "waste",
      variant: "meta",
      type: "text",
      format: (value) => (value ? value.toUpperCase() : "N/A"),
    },
    {
      key: "location_display",
      variant: "title",
      type: "text",
      multiField: {
        fields: ["address", "municipility"],
        format: (values) => {
          const filtered = values.filter(Boolean);
          return filtered.length > 0
            ? filtered.join(" ").toUpperCase()
            : "UBICAZIONE NON SPECIFICATA";
        },
      },
    },
    {
      key: "device_details",
      variant: "body",
      type: "custom",
      format: (_, data) => {
        const details = [];
        if (data.ip_Router) details.push(`IP: ${data.ip_Router}`);
        if (data.codice_Gps) details.push(`COD: ${data.codice_Gps}`);
        const statusText = data.status_Machine_Blocked
          ? "OPERATIVO"
          : "NON OPERATIVO";
        details.push(`Stato: ${statusText}`);
        return details.join("<br>");
      },
    },
  ],

  // Actions ora nel footer
  actions: [
    {
      key: "toggle_status",
      label: (data) => (data.status === 1 ? "Attivo" : "Riattiva"),
      variant: "warning",
      size: "md",
      disabled: (data) => data.status === 1,
      onClick: () => {}, // Gestito dall'hook
    },
    {
      key: "details",
      label: "Dettagli",
      variant: "primary",
      size: "md",
      onClick: () => {}, // Gestito dall'hook
    },
    {
      key: "ticket",
      label: "Ticket",
      variant: "secondary",
      size: "lg",
      onClick: () => {}, // Gestito dall'hook
    },
  ],

  // Configurazione footer
  footer: {
    show: true,
    variant: "default",
    showDivider: true,
    alignment: "space-between",
  },

  layout: {
    imageWeight: 3,
    contentWeight: 7,
    gap: "md",
  },
};
