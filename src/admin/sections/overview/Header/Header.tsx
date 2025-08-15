import React from 'react';
import { 
  Clock, 
  Download, 
  RefreshCw, 
  Settings, 
  Search, 
  Sun, 
  Moon 
} from 'lucide-react';
import styles from './Header.module.scss';


interface DashboardHeaderProps {
  selectedTimeRange: string;
  setSelectedTimeRange: (range: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({

  selectedTimeRange,
  setSelectedTimeRange
}) => {
  const timeRanges = ['24h', '7d', '30d', '90d'];
  
  

  return (
    <div className={styles.dashboardHeader}>
      <div className={styles.headerContent}>
        <div className={styles.titleSection}>
          <h1>PetStore Analytics</h1>
          <p>Dashboard completa per il tuo ecommerce di prodotti per animali</p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.quickStat}>
            <span className={styles.quickLabel}>Ultimo aggiornamento</span>
            <span className={styles.quickValue}>
              <Clock size={14} />
              2 min fa
            </span>
          </div>
          <div className={styles.quickStat}>
            <span className={styles.quickLabel}>Sistema</span>
            <span className={`${styles.quickValue} ${styles.online}`}>
              <div className={styles.statusDot}></div>
              Online
            </span>
          </div>
        </div>
      </div>
      
      <div className={styles.headerActions}>
        <div className={styles.searchContainer}>
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Cerca..." 
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.timeRangeSelector}>
          {timeRanges.map(range => (
            <button
              key={range}
              className={`${styles.timeBtn} ${selectedTimeRange === range ? styles.active : ''}`}
              onClick={() => setSelectedTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
        
        <button className={styles.btnSecondary}>
          <Download size={16} />
          Esporta
        </button>
        
        <button className={styles.btnSecondary}>
          <Settings size={16} />
          Impostazioni
        </button>
        
       {/*  <button 
          className={styles.btnOutline}
          onClick={() => toggleTheme()}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button> */}
        
        <button className={styles.btnPrimary}>
          <RefreshCw size={16} />
          Aggiorna
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;