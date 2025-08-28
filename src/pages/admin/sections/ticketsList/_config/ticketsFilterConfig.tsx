export const TicketFields = {
  TITLE: "title",
  STATUS: "status",
  PRIORITY: "priority",
  CATEGORY: "category",
  ASSIGNED_TO: "assigned_to",
};

interface TicketFilterConfigProps {
  filters: Record<string, string>;
  setFilter: (field: string, value: string) => void;
}

export const createTicketsFilterConfig = ({
  filters,
  setFilter,
}: TicketFilterConfigProps) => {
  return [
    {
      key: TicketFields.TITLE,
      label: "Titolo/Descrizione",
      type: "text" as const,
      placeholder: "Cerca per titolo o descrizione...",
      value: filters[TicketFields.TITLE] || "",
      // Corretto: onChange riceve React.ChangeEvent<HTMLInputElement>
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFilter(TicketFields.TITLE, e.target.value),
    },
    {
      key: TicketFields.STATUS,
      label: "Stato",
      type: "select" as const,
      placeholder: "Tutti gli stati",
      value: filters[TicketFields.STATUS] || "",
      // Per select rimane string
      onChange: (value: string | null) =>
        setFilter(TicketFields.STATUS, value || ""),
      options: [
        { value: "", label: "Tutti gli stati" },
        { value: "open", label: "Aperto" },
        { value: "in_progress", label: "In Corso" },
        { value: "closed", label: "Chiuso" },
      ],
    },
    {
      key: TicketFields.PRIORITY,
      label: "Priorità",
      type: "select" as const,
      placeholder: "Tutte le priorità",
      value: filters[TicketFields.PRIORITY] || "",
      // Per select rimane string
      onChange: (value: string | null) =>
        setFilter(TicketFields.PRIORITY, value || ""),
      options: [
        { value: "", label: "Tutte le priorità" },
        { value: "low", label: "Bassa" },
        { value: "medium", label: "Media" },
        { value: "high", label: "Alta" },
        { value: "critical", label: "Critica" },
      ],
    },
    {
      key: TicketFields.CATEGORY,
      label: "Categoria",
      type: "select" as const,
      placeholder: "Tutte le categorie",
      value: filters[TicketFields.CATEGORY] || "",
      // Per select rimane string
      onChange: (value: string | null) =>
        setFilter(TicketFields.CATEGORY, value || ""),
      options: [
        { value: "", label: "Tutte le categorie" },
        { value: "bug", label: "Bug" },
        { value: "feature", label: "Feature" },
        { value: "enhancement", label: "Miglioramento" },
        { value: "performance", label: "Performance" },
        { value: "documentation", label: "Documentazione" },
        { value: "infrastructure", label: "Infrastruttura" },
        { value: "maintenance", label: "Manutenzione" },
        { value: "security", label: "Sicurezza" },
      ],
    },
    {
      key: TicketFields.ASSIGNED_TO,
      label: "Assegnato a",
      type: "text" as const,
      placeholder: "Nome o email...",
      value: filters[TicketFields.ASSIGNED_TO] || "",
      // Corretto: onChange riceve React.ChangeEvent<HTMLInputElement>
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFilter(TicketFields.ASSIGNED_TO, e.target.value),
    },
  ];
};
