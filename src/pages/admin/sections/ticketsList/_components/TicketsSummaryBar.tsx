import React from "react";
import {
  SummaryBar,
  type SummaryItem,
} from "../../_commons/components/SectionSummary/SectionSummary.component";
import type { TicketRead } from "@store_admin/tickets/ticket.types";

type Props = {
  tickets: TicketRead[];
  className?: string;
  /**
   * Facoltativo: risolvi la severità del ticket.
   * Ritorna "warning" | "error" | null per ogni ticket.
   */
  severityResolver?: (t: TicketRead) => "warning" | "error" | null;
};

/** Mappa stati:
 *  - 1 => aperto
 *  - 2 => chiuso
 */
const isOpen = (t: TicketRead) => Number((t as any).status) === 1;
const isClosed = (t: TicketRead) => Number((t as any).status) === 2;

export const TicketsSummaryBar: React.FC<Props> = ({
  tickets,
  className,
  severityResolver,
}) => {
  const total = tickets.length;

  const openCount = tickets.filter(isOpen).length;
  const closedCount = tickets.filter(isClosed).length;

  // Severità: se non passi un resolver, restano a 0
  let warningCount = 0;
  let errorCount = 0;

  if (typeof severityResolver === "function") {
    for (const t of tickets) {
      const sev = severityResolver(t);
      if (sev === "warning") warningCount++;
      if (sev === "error") errorCount++;
    }
  }

  const items: SummaryItem[] = [
    { number: openCount, label: "Aperti", variant: "statCard--open" },
    { number: closedCount, label: "Chiusi", variant: "statCard--closed" },
    { number: warningCount, label: "Warning", variant: "statCard--warning" },
    { number: errorCount, label: "Error", variant: "statCard--error" },
  ];

  return (
    <SummaryBar
      className={className}
      title="Dashboard Tickets"
      totalLabel="tickets totali"
      totalNumber={total}
      items={items}
    />
  );
};

export default TicketsSummaryBar;
