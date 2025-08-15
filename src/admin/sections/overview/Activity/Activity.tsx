import React from 'react';
import { 
  Bell, 
  ShoppingCart, 
  Heart, 
  Star, 
  AlertTriangle, 
  Users, 
  MapPin,
  ChevronRight,
  Eye,
  RefreshCw
} from 'lucide-react';
import styles from './Activity.module.scss';

interface Activity {
  id: number;
  customer: string;
  action: string;
  time: string;
  type: 'success' | 'donation' | 'review' | 'warning' | 'info';
  details: string;
  location: string;
}

const ActivityFeed: React.FC = () => {
  const recentActivity: Activity[] = [
    {
      id: 1,
      customer: "Maria Rossi",
      action: "Ordine completato",
      time: "2 min fa",
      type: "success",
      details: "Cibo Premium per Cani - €45.90",
      location: "Milano, IT"
    },
    {
      id: 2,
      customer: "Luca Bianchi",
      action: "Donazione ricevuta",
      time: "8 min fa",
      type: "donation",
      details: "Donazione per rifugio - €25.00",
      location: "Roma, IT"
    },
    {
      id: 3,
      customer: "Anna Verdi",
      action: "Recensione 5 stelle",
      time: "15 min fa",
      type: "review",
      details: "Giocattolo per Gatti",
      location: "Napoli, IT"
    },
    {
      id: 4,
      customer: "Sistema",
      action: "Stock basso",
      time: "32 min fa",
      type: "warning",
      details: "Cibo Gatti Premium - 12 unità",
      location: "Magazzino"
    },
    {
      id: 5,
      customer: "Marco Ferrari",
      action: "Nuovo cliente",
      time: "1h fa",
      type: "info",
      details: "Registrazione completata",
      location: "Torino, IT"
    }
  ];

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'success':
        return <ShoppingCart size={16} />;
      case 'donation':
        return <Heart size={16} />;
      case 'review':
        return <Star size={16} />;
      case 'warning':
        return <AlertTriangle size={16} />;
      case 'info':
        return <Users size={16} />;
      default:
        return <Users size={16} />;
    }
  };

  const successCount = recentActivity.filter(activity => activity.type === 'success').length;
  const donationCount = recentActivity.filter(activity => activity.type === 'donation').length;

  return (
    <div className={styles.activityFeed}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <Bell size={20} />
          <h2>Attività in Tempo Reale</h2>
          <span className={styles.liveIndicator}>Live</span>
        </div>
        <button className={styles.sectionAction}>
          Visualizza tutti
          <ChevronRight size={16} />
        </button>
      </div>

      <div className={styles.activityList}>
        {recentActivity.map((activity) => (
          <div 
            key={activity.id} 
            className={`${styles.activityItem} ${styles[`activity${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}`]}`}
          >
            <div className={`${styles.activityIcon} ${styles[`activityIcon${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}`]}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className={styles.activityContent}>
              <div className={styles.activityHeader}>
                <span className={styles.activityCustomer}>{activity.customer}</span>
                <span className={styles.activityTime}>{activity.time}</span>
              </div>
              <div className={styles.activityTitle}>{activity.action}</div>
              <div className={styles.activityDetails}>
                <span className={styles.activityDetailText}>{activity.details}</span>
                <span className={styles.activityLocation}>
                  <MapPin size={12} />
                  {activity.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.activityFooter}>
        <div className={styles.footerStats}>
          <div className={styles.footerStat}>
            <span className={styles.statValue}>{successCount}</span>
            <span className={styles.statLabel}>Ordini</span>
          </div>
          <div className={styles.footerStat}>
            <span className={styles.statValue}>{donationCount}</span>
            <span className={styles.statLabel}>Donazioni</span>
          </div>
        </div>
        
        <div className={styles.footerActions}>
          <button className={styles.viewAllBtn}>
            <Eye size={14} />
            Vedi tutti
          </button>
          <button className={styles.refreshBtn}>
            <RefreshCw size={14} />
            Aggiorna
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;