import React from 'react';
import { AlertTriangle, X, Clock, CheckCircle, ChevronRight, Eye, CheckCheck } from 'lucide-react';
import styles from './Alerts.module.scss';

interface Alert {
  id: number;
  type: 'critical' | 'warning' | 'info';
  message: string;
  time: string;
}

interface AlertsPanelProps {
  alerts?: Alert[];
  maxItems?: number;
  onDismiss?: (alertId: number) => void;
  onMarkAllRead?: () => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ 
  alerts,
  maxItems = 6,
  onDismiss,
  onMarkAllRead 
}) => {
  const defaultAlerts: Alert[] = [
    { id: 1, type: "critical", message: "Stock critico: Cibo Gatti Premium (8 unità rimaste)", time: "1h fa" },
    { id: 2, type: "warning", message: "Ordine in ritardo: #ORD-2847 - Cliente contattato", time: "2h fa" },
    { id: 3, type: "info", message: "Nuova partnership attivata con rifugio locale", time: "4h fa" },
    { id: 4, type: "critical", message: "Pagamento fallito per ordine #ORD-2851", time: "6h fa" },
    { id: 5, type: "warning", message: "Recensione negativa ricevuta - richiede risposta", time: "8h fa" },
    { id: 6, type: "info", message: "Nuovo prodotto aggiunto al catalogo con successo", time: "12h fa" }
  ];

  const displayAlerts = (alerts || defaultAlerts).slice(0, maxItems);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle size={16} />;
      case 'warning':
        return <Clock size={16} />;
      case 'info':
        return <CheckCircle size={16} />;
      default:
        return <AlertTriangle size={16} />;
    }
  };

  const handleDismiss = (alertId: number) => {
    if (onDismiss) {
      onDismiss(alertId);
    }
  };

  const criticalCount = displayAlerts.filter(alert => alert.type === 'critical').length;
  const warningCount = displayAlerts.filter(alert => alert.type === 'warning').length;

  return (
    <div className={styles.alertsPanel}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <AlertTriangle size={20} />
          <h2>Avvisi e Notifiche</h2>
          <span className={styles.alertCount}>{displayAlerts.length}</span>
        </div>
        <button className={styles.sectionAction}>
          Visualizza tutti
          <ChevronRight size={16} />
        </button>
      </div>

      <div className={styles.alertsList}>
        {displayAlerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`${styles.alertItem} ${styles[`alert${alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}`]}`}
          >
            <div className={styles.alertIndicator}>
              {getAlertIcon(alert.type)}
            </div>
            
            <div className={styles.alertContent}>
              <div className={styles.alertMessage}>{alert.message}</div>
              <div className={styles.alertTime}>{alert.time}</div>
            </div>

            {onDismiss && (
              <button 
                className={styles.dismissBtn}
                onClick={() => handleDismiss(alert.id)}
                aria-label="Chiudi avviso"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className={styles.alertsFooter}>
        <div className={styles.footerStats}>
          <div className={styles.footerStat}>
            <span className={styles.statValue}>{criticalCount}</span>
            <span className={styles.statLabel}>Critici</span>
          </div>
          <div className={styles.footerStat}>
            <span className={styles.statValue}>{warningCount}</span>
            <span className={styles.statLabel}>Avvertimenti</span>
          </div>
        </div>
        
        <div className={styles.footerActions}>
          <button className={styles.viewAllBtn}>
            <Eye size={14} />
            Vedi tutti
          </button>
          {onMarkAllRead && (
            <button className={styles.markAllReadBtn} onClick={onMarkAllRead}>
              <CheckCheck size={14} />
              Segna letti
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;