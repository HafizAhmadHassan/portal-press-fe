import React from 'react';
import { 
  Target, 
  CreditCard, 
  Package, 
  Star, 
  ArrowUp, 
  ArrowDown 
} from 'lucide-react';
import styles from './QuickStats.module.scss';

interface QuickStat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}

const QuickStatsBar: React.FC = () => {
  const quickStats: QuickStat[] = [
    { 
      label: "Tasso Conversione", 
      value: "3.2%", 
      change: "+0.8%", 
      positive: true, 
      icon: <Target size={16} /> 
    },
    { 
      label: "Valore Medio Ordine", 
      value: "€67", 
      change: "+€5", 
      positive: true, 
      icon: <CreditCard size={16} /> 
    },
    { 
      label: "Prodotti in Stock", 
      value: "8,234", 
      change: "-12", 
      positive: false, 
      icon: <Package size={16} /> 
    },
    { 
      label: "Recensioni Positive", 
      value: "94.5%", 
      change: "+1.2%", 
      positive: true, 
      icon: <Star size={16} /> 
    }
  ];

  return (
    <div className={styles.quickStatsBar}>
      {quickStats.map((stat, index) => (
        <div key={index} className={styles.quickStatCard}>
          <div className={styles.quickStatContent}>
            <div className={styles.quickStatHeader}>
              <span className={styles.quickStatLabel}>{stat.label}</span>
              <div className={styles.quickStatIcon}>{stat.icon}</div>
            </div>
            <div className={styles.quickStatValue}>
              <span>{stat.value}</span>
              <span className={`${styles.quickStatChange} ${stat.positive ? styles.positive : styles.negative}`}>
                {stat.positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {stat.change}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStatsBar;