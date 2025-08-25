import React from 'react';
import { Heart, Users, MapPin, TrendingUp, Award, Gift } from 'lucide-react';
import styles from './Donations.module.scss';

interface DonationStats {
  totalDonated: string;
  animalsHelped: number;
  sheltersSupported: number;
  avgDonation: string;
}

interface DonationPanelProps {
  donationStats?: DonationStats;
  loading?: boolean;
}

const DonationPanel: React.FC<DonationPanelProps> = ({
  donationStats,
  loading = false
}) => {
  const defaultStats: DonationStats = {
    totalDonated: "€23,450",
    animalsHelped: 156,
    sheltersSupported: 12,
    avgDonation: "€35"
  };

  const stats = donationStats || defaultStats;

  const impactMetrics = [
    {
      icon: <Gift size={20} />,
      label: "Pasti Forniti",
      value: "4,280",
      description: "pasti per animali bisognosi",
      color: "orange"
    },
    {
      icon: <Users size={20} />,
      label: "Famiglie Aiutate",
      value: "89",
      description: "famiglie con animali",
      color: "blue"
    },
    {
      icon: <Award size={20} />,
      label: "Cure Veterinarie",
      value: "45",
      description: "interventi salvavita",
      color: "purple"
    }
  ];

  const recentDonations = [
    { donor: "Marco R.", amount: "€50", cause: "Cibo per cani", time: "2h fa" },
    { donor: "Anna B.", amount: "€25", cause: "Cure veterinarie", time: "4h fa" },
    { donor: "Luigi M.", amount: "€100", cause: "Rifugio gatti", time: "6h fa" },
    { donor: "Sara T.", amount: "€30", cause: "Cibo per gatti", time: "8h fa" }
  ];

  if (loading) {
    return (
      <div className={styles.donationPanel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <Heart size={20} />
            <h2>Impatto Donazioni</h2>
          </div>
        </div>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}>Caricamento...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.donationPanel}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <Heart size={20} />
          <h2>Impatto Donazioni</h2>
        </div>
        <div className={styles.headerBadge}>
          <TrendingUp size={14} />
          <span>+24.7% questo mese</span>
        </div>
      </div>

      <div className={styles.donationContent}>
        {/* Main Stats Grid */}
        <div className={styles.donationGrid}>
          <div className={`${styles.donationCard} ${styles.donationCardPrimary}`}>
            <div className={styles.cardIcon}>
              <Heart size={24} />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.donationValue}>{stats.totalDonated}</div>
              <div className={styles.donationLabel}>Totale Donato</div>
            </div>
          </div>
          
          <div className={`${styles.donationCard} ${styles.donationCardSecondary}`}>
            <div className={styles.cardIcon}>
              <Users size={24} />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.donationValue}>{stats.animalsHelped}</div>
              <div className={styles.donationLabel}>Animali Aiutati</div>
            </div>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className={styles.impactSection}>
          <h3 className={styles.sectionSubtitle}>Impatto nel Dettaglio</h3>
          <div className={styles.impactGrid}>
            {impactMetrics.map((metric, index) => (
              <div key={index} className={`${styles.impactCard} ${styles[`impact${metric.color.charAt(0).toUpperCase() + metric.color.slice(1)}`]}`}>
                <div className={styles.impactIcon}>
                  {metric.icon}
                </div>
                <div className={styles.impactContent}>
                  <div className={styles.impactValue}>{metric.value}</div>
                  <div className={styles.impactLabel}>{metric.label}</div>
                  <div className={styles.impactDescription}>{metric.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Stats */}
        <div className={styles.donationStats}>
          <div className={styles.donationStatItem}>
            <div className={styles.statIcon}>
              <MapPin size={16} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.donationStatLabel}>Rifugi Supportati</span>
              <span className={styles.donationStatValue}>{stats.sheltersSupported}</span>
            </div>
          </div>
          
          <div className={styles.donationStatItem}>
            <div className={styles.statIcon}>
              <TrendingUp size={16} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.donationStatLabel}>Donazione Media</span>
              <span className={styles.donationStatValue}>{stats.avgDonation}</span>
            </div>
          </div>
        </div>

        {/* Recent Donations */}
        <div className={styles.recentDonations}>
          <h3 className={styles.sectionSubtitle}>Donazioni Recenti</h3>
          <div className={styles.donationsList}>
            {recentDonations.map((donation, index) => (
              <div key={index} className={styles.donationItem}>
                <div className={styles.donationItemIcon}>
                  <Heart size={14} />
                </div>
                <div className={styles.donationItemContent}>
                  <div className={styles.donationItemHeader}>
                    <span className={styles.donorName}>{donation.donor}</span>
                    <span className={styles.donationAmount}>{donation.amount}</span>
                  </div>
                  <div className={styles.donationItemFooter}>
                    <span className={styles.donationCause}>{donation.cause}</span>
                    <span className={styles.donationTime}>{donation.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={styles.donationCta}>
          <div className={styles.ctaContent}>
            <h4>Aiuta più animali</h4>
            <p>Condividi la pagina donazioni per aumentare l'impatto</p>
          </div>
          <button className={styles.ctaButton}>
            <Heart size={16} />
            Promuovi Donazioni
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationPanel;