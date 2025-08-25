import React from 'react';
import { ShoppingCart, Package, Heart, Users, ArrowUp, ArrowDown } from 'lucide-react';
import MiniChart from '../shared/MiniChart';
import styles from './MainStats.module.scss';

interface Stat {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  subtitle: string;
  period: string;
  status: string;
  color: 'green' | 'blue' | 'purple' | 'orange';
  icon: React.ReactNode;
  trend: number[];
}

const MainStatsGrid: React.FC = () => {
  const stats: Stat[] = [
    {
      title: "VENDITE TOTALI",
      value: "€47,234",
      change: "+18.5%",
      changeType: "positive",
      subtitle: "rispetto al mese scorso",
      period: "Ultimi 7 giorni",
      status: "In crescita",
      color: "green",
      icon: <ShoppingCart size={24} />,
      trend: [650, 780, 720, 850, 920, 880, 950]
    },
    {
      title: "ORDINI ATTIVI",
      value: "1,247",
      change: "+12.3%",
      changeType: "positive",
      subtitle: "ordini da processare",
      period: "Tempo reale",
      status: "Operativo",
      color: "blue",
      icon: <Package size={24} />,
      trend: [450, 520, 480, 610, 580, 650, 670]
    },
    {
      title: "DONAZIONI",
      value: "€8,945",
      change: "+24.7%",
      changeType: "positive",
      subtitle: "aiuto agli animali",
      period: "Questo mese",
      status: "Eccellente",
      color: "purple",
      icon: <Heart size={24} />,
      trend: [180, 190, 210, 220, 230, 240, 245]
    },
    {
      title: "CLIENTI ATTIVI",
      value: "2,847",
      change: "+8.9%",
      changeType: "positive",
      subtitle: "utenti registrati",
      period: "Ultimi 30 giorni",
      status: "Stabile",
      color: "orange",
      icon: <Users size={24} />,
      trend: [240, 260, 250, 270, 280, 270, 285]
    }
  ];

  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`${styles.statCard} ${styles[`statCard${stat.color.charAt(0).toUpperCase() + stat.color.slice(1)}`]}`}
        >
          <div className={styles.statCardHeader}>
            <div className={styles.statInfo}>
              <div className={styles.statIcon}>
                {stat.icon}
              </div>
              <div className={styles.statMeta}>
                <h3 className={styles.statTitle}>{stat.title}</h3>
                <span className={styles.statPeriod}>{stat.period}</span>
              </div>
            </div>
            <div className={styles.statTrend}>
              <MiniChart 
                data={stat.trend} 
                color={`var(--${stat.color}-color)`} 
              />
            </div>
          </div>
          
          <div className={styles.statValue}>{stat.value}</div>
          
          <div className={styles.statFooter}>
            <span className={styles.statSubtitle}>{stat.subtitle}</span>
            <div className={styles.statBadgeContainer}>
              <span className={`${styles.statChange} ${styles[`statChange${stat.changeType.charAt(0).toUpperCase() + stat.changeType.slice(1)}`]}`}>
                {stat.changeType === 'positive' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                {stat.change}
              </span>
              <span className={`${styles.statusBadge} ${styles[`statusBadge${stat.color.charAt(0).toUpperCase() + stat.color.slice(1)}`]}`}>
                {stat.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainStatsGrid;