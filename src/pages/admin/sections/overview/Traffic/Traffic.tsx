import React, { useState } from 'react';
import { Globe, Monitor, Smartphone, Tablet, TrendingUp, Users, Eye, BarChart3 } from 'lucide-react';
import styles from './Traffic.module.scss';

interface TrafficSource {
  source: string;
  percentage: number;
  visitors: string;
  color: string;
  growth: string;
  conversionRate: number;
}

interface DeviceStats {
  device: string;
  percentage: number;
  icon: React.ReactNode;
  visitors: string;
  avgSession: string;
}

interface TrafficSourcesProps {
  sources?: TrafficSource[];
  deviceStats?: DeviceStats[];
  loading?: boolean;
}

const TrafficSources: React.FC<TrafficSourcesProps> = ({
  sources,
  deviceStats,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState<'sources' | 'devices'>('sources');

  const defaultSources: TrafficSource[] = [
    { 
      source: "Ricerca Organica", 
      percentage: 45, 
      visitors: "12,345", 
      color: "#10b981",
      growth: "+12%",
      conversionRate: 3.2
    },
    { 
      source: "Social Media", 
      percentage: 28, 
      visitors: "7,891", 
      color: "#3b82f6",
      growth: "+8%",
      conversionRate: 2.1
    },
    { 
      source: "Email Marketing", 
      percentage: 15, 
      visitors: "4,234", 
      color: "#f59e0b",
      growth: "+15%",
      conversionRate: 4.7
    },
    { 
      source: "Pubblicità", 
      percentage: 12, 
      visitors: "3,456", 
      color: "#8b5cf6",
      growth: "+23%",
      conversionRate: 1.8
    }
  ];

  const defaultDeviceStats: DeviceStats[] = [
    { 
      device: "Desktop", 
      percentage: 58, 
      icon: <Monitor size={20} />,
      visitors: "15,842",
      avgSession: "4:32"
    },
    { 
      device: "Mobile", 
      percentage: 32, 
      icon: <Smartphone size={20} />,
      visitors: "8,743",
      avgSession: "2:18"
    },
    { 
      device: "Tablet", 
      percentage: 10, 
      icon: <Tablet size={20} />,
      visitors: "2,731",
      avgSession: "3:45"
    }
  ];

  const trafficSources = sources || defaultSources;
  const devices = deviceStats || defaultDeviceStats;

  const totalVisitors = trafficSources.reduce((sum, source) => 
    sum + parseInt(source.visitors.replace(',', '')), 0
  );

  const avgConversionRate = trafficSources.reduce((sum, source) => 
    sum + source.conversionRate, 0
  ) / trafficSources.length;

  if (loading) {
    return (
      <div className={styles.trafficSourcesCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <Globe size={20} />
            <h2>Analisi Traffico</h2>
          </div>
        </div>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}>Caricamento...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.trafficSourcesCard}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <Globe size={20} />
          <h2>Analisi Traffico</h2>
          <div className={styles.summaryBadge}>
            <Users size={14} />
            <span>{totalVisitors.toLocaleString()} visitatori</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.tabSelector}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'sources' ? styles.active : ''}`}
              onClick={() => setActiveTab('sources')}
            >
              <BarChart3 size={14} />
              Sorgenti
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'devices' ? styles.active : ''}`}
              onClick={() => setActiveTab('devices')}
            >
              <Monitor size={14} />
              Dispositivi
            </button>
          </div>
          <button className={styles.detailsBtn}>
            <Eye size={16} />
            Dettagli
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className={styles.summaryStats}>
        <div className={styles.summaryItem}>
          <div className={styles.summaryIcon}>
            <Users size={20} />
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryValue}>{totalVisitors.toLocaleString()}</span>
            <span className={styles.summaryLabel}>Visitatori Totali</span>
          </div>
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryIcon}>
            <TrendingUp size={20} />
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryValue}>{avgConversionRate.toFixed(1)}%</span>
            <span className={styles.summaryLabel}>Conversione Media</span>
          </div>
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryIcon}>
            <Globe size={20} />
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryValue}>3:24</span>
            <span className={styles.summaryLabel}>Sessione Media</span>
          </div>
        </div>
      </div>

      <div className={styles.contentContainer}>
        {activeTab === 'sources' ? (
          <div className={styles.sourcesContent}>
            <div className={styles.contentHeader}>
              <h3>Sorgenti di Traffico</h3>
              <span className={styles.contentSubtitle}>Ultimi 30 giorni</span>
            </div>
            
            <div className={styles.sourcesList}>
              {trafficSources.map((source, index) => (
                <div key={index} className={styles.sourceItem}>
                  <div className={styles.sourceInfo}>
                    <div 
                      className={styles.sourceIndicator}
                      style={{ backgroundColor: source.color }}
                    ></div>
                    <div className={styles.sourceDetails}>
                      <span className={styles.sourceName}>{source.source}</span>
                      <div className={styles.sourceMetrics}>
                        <span className={styles.sourceVisitors}>{source.visitors} visitatori</span>
                        <span className={styles.sourceConversion}>
                          {source.conversionRate}% conversione
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.sourceStats}>
                    <div className={styles.sourceGrowth}>
                      <TrendingUp size={12} />
                      <span>{source.growth}</span>
                    </div>
                    <div className={styles.sourcePercentage}>{source.percentage}%</div>
                    <div className={styles.sourceProgress}>
                      <div 
                        className={styles.sourceProgressFill}
                        style={{ 
                          width: `${source.percentage}%`,
                          backgroundColor: source.color 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.devicesContent}>
            <div className={styles.contentHeader}>
              <h3>Dispositivi Utilizzati</h3>
              <span className={styles.contentSubtitle}>Distribuzione del traffico</span>
            </div>
            
            <div className={styles.devicesList}>
              {devices.map((device, index) => (
                <div key={index} className={styles.deviceItem}>
                  <div className={styles.deviceInfo}>
                    <div className={styles.deviceIcon}>
                      {device.icon}
                    </div>
                    <div className={styles.deviceDetails}>
                      <span className={styles.deviceName}>{device.device}</span>
                      <div className={styles.deviceMetrics}>
                        <span className={styles.deviceVisitors}>{device.visitors} visitatori</span>
                        <span className={styles.deviceSession}>
                          Sessione media: {device.avgSession}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.deviceStats}>
                    <div className={styles.devicePercentage}>{device.percentage}%</div>
                    <div className={styles.deviceProgress}>
                      <div 
                        className={styles.deviceProgressFill}
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Device Insights */}
            <div className={styles.deviceInsights}>
              <h4>Insights Dispositivi</h4>
              <div className={styles.insightsList}>
                <div className={styles.insightItem}>
                  <span className={styles.insightLabel}>Dispositivo più utilizzato</span>
                  <span className={styles.insightValue}>
                    {devices.reduce((max, device) => 
                      device.percentage > max.percentage ? device : max
                    ).device}
                  </span>
                </div>
                <div className={styles.insightItem}>
                  <span className={styles.insightLabel}>Sessione più lunga</span>
                  <span className={styles.insightValue}>Desktop (4:32)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className={styles.cardFooter}>
        <div className={styles.footerStats}>
          <span className={styles.lastUpdate}>Aggiornato 2 min fa</span>
        </div>
        <div className={styles.footerActions}>
          <button className={styles.exportBtn}>Esporta Report</button>
          <button className={styles.analyticsBtn}>
            <BarChart3 size={14} />
            Analytics Avanzate
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrafficSources;