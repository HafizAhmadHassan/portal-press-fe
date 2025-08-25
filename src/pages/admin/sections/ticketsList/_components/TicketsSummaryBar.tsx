import React from 'react';
/* import type { Tickets } from '@store_admin/tickets/tickets.types'; */
import styles from '@sections_admin/ticketsList/_styles/TicketsSummaryBar.module.scss';

interface TicketsSummaryBarProps {
  tickets: any[]; // Cambiato da Tickets[] a any[]
  statusFilter?: 'tutti' | 'attivi' | 'disattivati';
  className?: string;
}

interface StatCardProps {
  number: number;
  label: string;
  variant: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label, variant, className = '' }) => (
  <div className={`${styles.statCard} ${styles[variant]} ${className}`}>
    <div className={styles.statNumber}>{number}</div>
    <div className={styles.statLabel}>{label}</div>
    {/*{percentage !== undefined && <div className={_styles.statPercentage}>{percentage}%</div>}*/}
  </div>
);

export const TicketsSummaryBar: React.FC<TicketsSummaryBarProps> = ({
  tickets,
  className = '',
}) => {
  // Calcola le statistiche usando i campi del Device type
  const totalTickets = tickets.length;
  const activeTickets = tickets.filter((device) => device.status === 1).length;
  const inactiveTickets = tickets.filter((device) => device.status === 0).length;
  const blockedTickets = tickets.filter((device) => device.statusMachineBlocked === true).length;
  const readyTickets = tickets.filter((device) => device.statusReadyD75_3_7 === true).length;

  return (
    <div className={`${styles.ticketsSummary} ${className}`}>
      {/* Mobile Layout */}
      <div className={styles.mobileLayout}>
        <div className={styles.mobileHeader}>
          <h3 className={styles.mobileTitle}>Dashboard Dispositivi</h3>
          <div className={styles.mobileTotal}>
            <span className={styles.mobileTotalNumber}>{totalTickets}</span>
            <span className={styles.mobileTotalLabel}>dispositivi totali</span>
          </div>
        </div>

        <div className={styles.mobileStats}>
          <StatCard number={activeTickets} label="Attivi" variant="statCard--active" />
          <StatCard number={inactiveTickets} label="Inattivi" variant="statCard--inactive" />
          <StatCard number={blockedTickets} label="Bloccati" variant="statCard--blocked" />
          <StatCard number={readyTickets} label="Pronti" variant="statCard--ready" />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className={styles.desktopLayout}>
        <div className={styles.statsSection}>
          <StatCard number={totalTickets} label="Totali" variant="statCard--total" />

          <div className={styles.statDivider}></div>

          <StatCard number={activeTickets} label="Attivi" variant="statCard--active" />

          <StatCard number={inactiveTickets} label="Inattivi" variant="statCard--inactive" />

          <div className={styles.statDivider}></div>

          <StatCard number={blockedTickets} label="Bloccati" variant="statCard--blocked" />

          <StatCard number={readyTickets} label="Pronti" variant="statCard--ready" />
        </div>
      </div>
    </div>
  );
};
