import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Bell,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Gauge,
  MapPin,
  Package,
  PieChart,
  RefreshCw,
  Shield,
  TrendingUp,
  Users,
  Wifi,
} from 'lucide-react';
import styles from './styles/AnalyticsOverview.module.scss';

const AnalyticsOverview = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const stats = [
    {
      title: "TOTALE CONFERIMENTI",
      value: "2,847",
      change: "+12.5%",
      changeType: "positive",
      subtitle: "rispetto al mese scorso",
      period: "Ultimi 7 giorni",
      status: "In aumento",
      color: "green",
      icon: <Package size={24} />,
      trend: [65, 78, 72, 85, 92, 88, 95]
    },
    {
      title: "ORE OPERATIVE",
      value: "87,234",
      change: "+8.2%",
      changeType: "positive",
      subtitle: "Da inizio anno",
      period: "Ultimi 7 giorni",
      status: "Eccellente",
      color: "blue",
      icon: <Clock size={24} />,
      trend: [45, 52, 48, 61, 58, 65, 67]
    },
    {
      title: "EFFICIENZA MEDIA",
      value: "94.2%",
      change: "+3.1%",
      changeType: "positive",
      subtitle: "rispetto al mese scorso",
      period: "Ultimi 7 giorni",
      status: "Ottimale",
      color: "purple",
      icon: <Gauge size={24} />,
      trend: [88, 89, 91, 92, 93, 94, 94.2]
    },
    {
      title: "DISPOSITIVI ATTIVI",
      value: "28/30",
      change: "+2",
      changeType: "positive",
      subtitle: "dispositivi online",
      period: "In tempo reale",
      status: "Operativo",
      color: "orange",
      icon: <Wifi size={24} />,
      trend: [24, 26, 25, 27, 28, 27, 28]
    }
  ];

  const quickStats = [
    { label: "Raccolta Giornaliera", value: "12.5 ton", change: "+5.2%", positive: true },
    { label: "Tempo Medio Ciclo", value: "4.2 min", change: "-8.1%", positive: true },
    { label: "Riempimento Medio", value: "76%", change: "+2.3%", positive: true },
    { label: "Allerte Attive", value: "3", change: "+1", positive: false }
  ];

  const deviceStats = {
    totali: 30,
    attivi: 28,
    inattivi: 2,
    bloccati: 0,
    manutenzione: 1,
    byLocation: [
      { name: "Centro", devices: 12, active: 11 },
      { name: "Nord", devices: 8, active: 8 },
      { name: "Sud", devices: 6, active: 5 },
      { name: "Est", devices: 4, active: 4 }
    ]
  };

  const wasteTypes = [
    { type: "PLASTICA", percentage: 35, color: "#f59e0b", amount: "4.2 ton" },
    { type: "CARTA", percentage: 28, color: "#3b82f6", amount: "3.4 ton" },
    { type: "ORGANICO", percentage: 22, color: "#10b981", amount: "2.7 ton" },
    { type: "VETRO", percentage: 15, color: "#8b5cf6", amount: "1.8 ton" }
  ];

  const recentActivity = [
    {
      id: 1,
      device: "Device 12",
      action: "Conferimento completato",
      time: "2 min fa",
      type: "success",
      details: "Plastica - 2.3kg",
      location: "Via Roma, 15"
    },
    {
      id: 2,
      device: "Device 7",
      action: "Manutenzione programmata",
      time: "15 min fa",
      type: "warning",
      details: "Pulizia sensori",
      location: "Piazza Centrale"
    },
    {
      id: 3,
      device: "Device 23",
      action: "Svuotamento richiesto",
      time: "23 min fa",
      type: "info",
      details: "Capacità 95%",
      location: "Via Verdi, 8"
    },
    {
      id: 4,
      device: "Device 5",
      action: "Errore sensore peso",
      time: "1h fa",
      type: "error",
      details: "Codice: ERR_001",
      location: "Corso Italia, 42"
    },
    {
      id: 5,
      device: "Device 18",
      action: "Nuovo utente registrato",
      time: "2h fa",
      type: "info",
      details: "QR Code scansionato",
      location: "Via Mazzini, 7"
    }
  ];

  const performanceData = [
    { month: "Gen", conferimenti: 2400, efficienza: 92 },
    { month: "Feb", conferimenti: 2100, efficienza: 89 },
    { month: "Mar", conferimenti: 2800, efficienza: 94 },
    { month: "Apr", conferimenti: 2600, efficienza: 91 },
    { month: "Mag", conferimenti: 3200, efficienza: 96 },
    { month: "Giu", conferimenti: 2900, efficienza: 93 }
  ];

  const topDevices = [
    { name: "Device 12", location: "Centro", efficiency: 98.5, collections: 342 },
    { name: "Device 7", location: "Nord", efficiency: 97.2, collections: 289 },
    { name: "Device 23", location: "Sud", efficiency: 96.8, collections: 267 },
    { name: "Device 15", location: "Est", efficiency: 95.1, collections: 234 },
    { name: "Device 3", location: "Centro", efficiency: 94.7, collections: 298 }
  ];

  const alerts = [
    { id: 1, type: "critical", message: "Device 5 - Sensore peso malfunzionante", time: "1h fa" },
    { id: 2, type: "warning", message: "Device 18 - Capacità al 95%", time: "2h fa" },
    { id: 3, type: "info", message: "Manutenzione programmata domani", time: "4h fa" }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Attivo': return <Activity className={`${styles.statusIcon} ${styles.active}`} />;
      case 'Inattivo': return <AlertTriangle className={`${styles.statusIcon} ${styles.inactive}`} />;
      case 'Bloccato': return <Shield className={`${styles.statusIcon} ${styles.blocked}`} />;
      default: return <Activity className={styles.statusIcon} />;
    }
  };

  const MiniChart = ({ data, color }) => (
    <div className={styles.miniChart}>
      <svg width="60" height="20" viewBox="0 0 60 20">
        <polyline
          points={data.map((val, i) => `${(i / (data.length - 1)) * 60},${20 - (val / Math.max(...data)) * 20}`).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
      </svg>
    </div>
  );

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "#10b981" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    return (
      <div className={styles.circularProgress} style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className={styles.progressCircle}
          />
        </svg>
        <div className={styles.progressText}>
          <span className={styles.progressValue}>{percentage}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.analyticsDashboard}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1>Smart Waste Analytics</h1>
            <p>Dashboard di monitoraggio e controllo del sistema di raccolta intelligente</p>
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
          <div className={styles.timeRangeSelector}>
            {['24h', '7d', '30d', '90d'].map(range => (
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
          <button className={styles.btnPrimary}>
            <RefreshCw size={16} />
            Aggiorna
          </button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className={styles.quickStatsBar}>
        {quickStats.map((stat, index) => (
          <div key={index} className={styles.quickStatCard}>
            <div className={styles.quickStatContent}>
              <span className={styles.quickStatLabel}>{stat.label}</span>
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

      {/* Main Stats Cards */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={`${styles.statCard} ${styles[`statCard${stat.color.charAt(0).toUpperCase() + stat.color.slice(1)}`]}`}>
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
                <MiniChart data={stat.trend} color={`var(--${stat.color}-color)`} />
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

      {/* Charts and Analysis Section */}
      <div className={styles.chartsSection}>
        {/* Performance Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>
              <BarChart3 size={20} />
              <h3>Performance Mensile</h3>
            </div>
            <div className={styles.chartActions}>
              <button className={styles.chartBtn}>
                <Filter size={16} />
              </button>
            </div>
          </div>
          <div className={styles.chartContent}>
            <div className={styles.chartLegend}>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: 'var(--primary-color)' }}></div>
                <span>Conferimenti</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: 'var(--success-color)' }}></div>
                <span>Efficienza %</span>
              </div>
            </div>
            <div className={styles.barChart}>
              {performanceData.map((data, index) => (
                <div key={index} className={styles.barGroup}>
                  <div className={styles.barContainer}>
                    <div
                      className={styles.bar}
                      style={{
                        height: `${(data.conferimenti / 3200) * 100}%`,
                        backgroundColor: 'var(--primary-color)'
                      }}
                    ></div>
                    <div
                      className={styles.bar}
                      style={{
                        height: `${data.efficienza}%`,
                        backgroundColor: 'var(--success-color)'
                      }}
                    ></div>
                  </div>
                  <span className={styles.barLabel}>{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Waste Distribution */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>
              <PieChart size={20} />
              <h3>Distribuzione Rifiuti</h3>
            </div>
          </div>
          <div className={styles.pieChartContainer}>
            <div className={styles.pieChart}>
              <svg width="200" height="200" viewBox="0 0 200 200">
                {wasteTypes.map((waste, index) => {
                  const radius = 80;
                  const centerX = 100;
                  const centerY = 100;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDasharray = `${(waste.percentage / 100) * circumference} ${circumference}`;
                  const rotation = wasteTypes.slice(0, index).reduce((sum, w) => sum + (w.percentage / 100) * 360, 0);

                  return (
                    <circle
                      key={index}
                      cx={centerX}
                      cy={centerY}
                      r={radius}
                      fill="none"
                      stroke={waste.color}
                      strokeWidth="16"
                      strokeDasharray={strokeDasharray}
                      transform={`rotate(${rotation - 90} ${centerX} ${centerY})`}
                      className={styles.pieSlice}
                    />
                  );
                })}
              </svg>
              <div className={styles.pieCenter}>
                <span className={styles.pieTotal}>12.1</span>
                <span className={styles.pieLabel}>ton totali</span>
              </div>
            </div>
            <div className={styles.wasteTypesList}>
              {wasteTypes.map((waste, index) => (
                <div key={index} className={styles.wasteTypeItem}>
                  <div className={styles.wasteTypeInfo}>
                    <div
                      className={styles.wasteTypeColor}
                      style={{ backgroundColor: waste.color }}
                    ></div>
                    <span className={styles.wasteTypeName}>{waste.type}</span>
                  </div>
                  <div className={styles.wasteTypeStats}>
                    <span className={styles.wasteTypeAmount}>{waste.amount}</span>
                    <span className={styles.wasteTypePercentage}>{waste.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className={styles.dashboardGrid}>
        {/* Device Overview */}
        <div className={styles.deviceOverview}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Activity size={20} />
              <h2>Panoramica Dispositivi</h2>
            </div>
            <span className={styles.deviceCount}>{deviceStats.totali} dispositivi</span>
          </div>

          <div className={styles.deviceSummaryGrid}>
            <div className={styles.deviceStatusCard}>
              <CircularProgress percentage={Math.round((deviceStats.attivi / deviceStats.totali) * 100)} />
              <div className={styles.deviceStatusInfo}>
                <h4>Dispositivi Attivi</h4>
                <span className={styles.deviceStatusCount}>{deviceStats.attivi}/{deviceStats.totali}</span>
              </div>
            </div>

            <div className={styles.deviceLocationsList}>
              {deviceStats.byLocation.map((location, index) => (
                <div key={index} className={styles.locationItem}>
                  <div className={styles.locationInfo}>
                    <MapPin size={16} />
                    <span className={styles.locationName}>{location.name}</span>
                  </div>
                  <div className={styles.locationStats}>
                    <span className={styles.locationCount}>{location.active}/{location.devices}</span>
                    <div className={styles.locationProgress}>
                      <div
                        className={styles.locationProgressFill}
                        style={{ width: `${(location.active / location.devices) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Activity */}
        <div className={styles.activityFeed}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Bell size={20} />
              <h2>Attività in Tempo Reale</h2>
            </div>
            <span className={styles.liveIndicator}>Live</span>
          </div>

          <div className={styles.activityList}>
            {recentActivity.map((activity) => (
              <div key={activity.id} className={styles.activityItem}>
                <div className={`${styles.activityIcon} ${styles[`activityIcon${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}`]}`}>
                  {activity.type === 'success' && <Activity size={16} />}
                  {activity.type === 'warning' && <AlertTriangle size={16} />}
                  {activity.type === 'error' && <Shield size={16} />}
                  {activity.type === 'info' && <Users size={16} />}
                </div>
                <div className={styles.activityContent}>
                  <div className={styles.activityHeader}>
                    <span className={styles.activityDevice}>{activity.device}</span>
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
        </div>

        {/* Top Performing Devices */}
        <div className={styles.topDevicesCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <TrendingUp size={20} />
              <h2>Top Dispositivi</h2>
            </div>
            <button className={styles.sectionAction}>
              Vedi tutti
              <ChevronRight size={16} />
            </button>
          </div>

          <div className={styles.topDevicesList}>
            {topDevices.map((device, index) => (
              <div key={index} className={styles.topDeviceItem}>
                <div className={styles.deviceRank}>#{index + 1}</div>
                <div className={styles.deviceDetails}>
                  <div className={styles.deviceHeader}>
                    <span className={styles.deviceNameTop}>{device.name}</span>
                    <span className={styles.deviceEfficiency}>{device.efficiency}%</span>
                  </div>
                  <div className={styles.deviceMeta}>
                    <span className={styles.deviceLocation}>
                      <MapPin size={12} />
                      {device.location}
                    </span>
                    <span className={styles.deviceCollections}>
                      {device.collections} conferimenti
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts Panel */}
        <div className={styles.alertsPanel}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <AlertTriangle size={20} />
              <h2>Avvisi e Notifiche</h2>
            </div>
            <span className={styles.alertCount}>{alerts.length}</span>
          </div>

          <div className={styles.alertsList}>
            {alerts.map((alert) => (
              <div key={alert.id} className={`${styles.alertItem} ${styles[`alert${alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}`]}`}>
                <div className={styles.alertIndicator}></div>
                <div className={styles.alertContent}>
                  <div className={styles.alertMessage}>{alert.message}</div>
                  <div className={styles.alertTime}>{alert.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;