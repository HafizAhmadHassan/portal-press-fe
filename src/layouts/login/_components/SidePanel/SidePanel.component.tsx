// components/SidePanel/SidePanel.tsx
import React from "react";
import styles from "./SidePanel.module.scss";

const SidePanel: React.FC = () => {
  return (
    <div className={styles.sidePanel}>
      <div className={styles.featureList}>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 12L11 14L15 10"
                stroke="#4facfe"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="9" stroke="#4facfe" strokeWidth="2" />
            </svg>
          </div>
          <div className={styles.featureText}>
            <h4>Sicurezza Avanzata</h4>
            <p>Protezione completa dei tuoi dati</p>
          </div>
        </div>

        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                stroke="#667eea"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={styles.featureText}>
            <h4>Performance Ottimali</h4>
            <p>Velocità e affidabilità garantite</p>
          </div>
        </div>

        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M17 21V19C17 17.9 16.1 17 15 17H9C7.9 17 7 17.9 7 19V21"
                stroke="#764ba2"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="7" r="4" stroke="#764ba2" strokeWidth="2" />
            </svg>
          </div>
          <div className={styles.featureText}>
            <h4>Gestione Utenti</h4>
            <p>Controllo completo degli accessi</p>
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>99.9%</div>
          <div className={styles.statLabel}>Uptime</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>24/7</div>
          <div className={styles.statLabel}>Supporto</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>500K+</div>
          <div className={styles.statLabel}>Utenti</div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
