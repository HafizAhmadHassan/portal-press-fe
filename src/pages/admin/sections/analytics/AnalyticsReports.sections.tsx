import React, { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Award,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Edit,
  Eye,
  LineChart,
  Mail,
  MoreHorizontal,
  PieChart,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import styles from "./styles/AnalyticsReports.module.scss";

const AnalyticsReports = () => {
  const [selectedReport, setSelectedReport] = useState("overview");
  const [dateRange, setDateRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  const reportTypes = [
    {
      id: "overview",
      name: "Panoramica Generale",
      icon: <BarChart3 size={18} />,
    },
    {
      id: "performance",
      name: "Performance Dispositivi",
      icon: <TrendingUp size={18} />,
    },
    { id: "waste", name: "Analisi Rifiuti", icon: <PieChart size={18} /> },
    {
      id: "efficiency",
      name: "Efficienza Operativa",
      icon: <Target size={18} />,
    },
    { id: "users", name: "Comportamento Utenti", icon: <Users size={18} /> },
    {
      id: "environmental",
      name: "Impatto Ambientale",
      icon: <Award size={18} />,
    },
  ];

  const keyMetrics = [
    {
      title: "Volume Totale Raccolto",
      current: "156.7 ton",
      previous: "142.3 ton",
      change: "+10.1%",
      trend: "up",
      target: "160 ton",
      progress: 97.9,
    },
    {
      title: "Efficienza Media Sistema",
      current: "94.2%",
      previous: "91.8%",
      change: "+2.6%",
      trend: "up",
      target: "95%",
      progress: 99.2,
    },
    {
      title: "Tempo Medio Conferimento",
      current: "3.4 min",
      previous: "4.1 min",
      change: "-17.1%",
      trend: "up",
      target: "3 min",
      progress: 88.2,
    },
    {
      title: "Utenti Attivi",
      current: "8,247",
      previous: "7,891",
      change: "+4.5%",
      trend: "up",
      target: "9,000",
      progress: 91.6,
    },
  ];

  const wasteAnalysis = {
    byType: [
      {
        type: "Plastica",
        amount: 54.8,
        percentage: 35.0,
        trend: "+8.2%",
        color: "#f59e0b",
      },
      {
        type: "Carta",
        amount: 43.9,
        percentage: 28.0,
        trend: "+5.1%",
        color: "#3b82f6",
      },
      {
        type: "Organico",
        amount: 34.5,
        percentage: 22.0,
        trend: "+12.3%",
        color: "#10b981",
      },
      {
        type: "Vetro",
        amount: 23.5,
        percentage: 15.0,
        trend: "-2.1%",
        color: "#8b5cf6",
      },
    ],
    byLocation: [
      { area: "Centro Storico", amount: 45.2, devices: 12, avgFill: 78 },
      {
        area: "Zona Residenziale Nord",
        amount: 38.7,
        devices: 10,
        avgFill: 82,
      },
      { area: "Area Commerciale", amount: 42.1, devices: 8, avgFill: 85 },
      { area: "Periferia Sud", amount: 30.7, devices: 6, avgFill: 71 },
    ],
  };

  const performanceData = [
    {
      month: "Gen",
      collections: 2847,
      efficiency: 92.1,
      downtime: 3.2,
      users: 7234,
    },
    {
      month: "Feb",
      collections: 3156,
      efficiency: 94.3,
      downtime: 2.8,
      users: 7456,
    },
    {
      month: "Mar",
      collections: 3421,
      efficiency: 91.7,
      downtime: 4.1,
      users: 7698,
    },
    {
      month: "Apr",
      collections: 3789,
      efficiency: 95.2,
      downtime: 2.1,
      users: 7923,
    },
    {
      month: "Mag",
      collections: 4012,
      efficiency: 93.8,
      downtime: 3.5,
      users: 8156,
    },
    {
      month: "Giu",
      collections: 4234,
      efficiency: 96.1,
      downtime: 1.9,
      users: 8247,
    },
  ];

  const topDevices = [
    {
      id: "DEV-001",
      location: "Piazza Centrale",
      efficiency: 98.5,
      collections: 342,
      uptime: 99.2,
      avgTime: 2.8,
      revenue: "€2,340",
    },
    {
      id: "DEV-007",
      location: "Via Roma 15",
      efficiency: 97.2,
      collections: 289,
      uptime: 98.7,
      avgTime: 3.1,
      revenue: "€1,980",
    },
    {
      id: "DEV-023",
      location: "Corso Italia",
      efficiency: 96.8,
      collections: 267,
      uptime: 97.9,
      avgTime: 3.4,
      revenue: "€1,845",
    },
    {
      id: "DEV-015",
      location: "Viale Europa",
      efficiency: 95.1,
      collections: 234,
      uptime: 96.8,
      avgTime: 3.7,
      revenue: "€1,623",
    },
    {
      id: "DEV-030",
      location: "Via Mazzini",
      efficiency: 94.7,
      collections: 298,
      uptime: 95.4,
      avgTime: 4.1,
      revenue: "€1,789",
    },
  ];

  const scheduledReports = [
    {
      id: 1,
      name: "Report Mensile Performance",
      schedule: "Ogni 1° del mese",
      recipients: 3,
      lastSent: "1 Giu 2024",
      status: "active",
    },
    {
      id: 2,
      name: "Analisi Settimanale Rifiuti",
      schedule: "Ogni Lunedì",
      recipients: 5,
      lastSent: "24 Giu 2024",
      status: "active",
    },
    {
      id: 3,
      name: "Dashboard Esecutiva",
      schedule: "Ogni Venerdì",
      recipients: 2,
      lastSent: "28 Giu 2024",
      status: "paused",
    },
  ];

  const environmentalImpact = {
    co2Saved: { value: 12.4, unit: "ton CO₂", change: "+18.3%" },
    recyclingRate: { value: 87.2, unit: "%", change: "+5.1%" },
    energySaved: { value: 1.8, unit: "MWh", change: "+12.7%" },
    waterSaved: { value: 340, unit: "L", change: "+8.9%" },
  };

  const handleExport = (format) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // Simulate export completion
    }, 2000);
  };

  const LineChartComponent = ({ data, metric }) => {
    const maxValue = Math.max(...data.map((d) => d[metric]));
    const minValue = Math.min(...data.map((d) => d[metric]));
    const range = maxValue - minValue;
    const padding = range * 0.1; // 10% padding
    const adjustedMax = maxValue + padding;
    const adjustedMin = Math.max(0, minValue - padding);
    const adjustedRange = adjustedMax - adjustedMin;

    // Generate Y-axis labels
    const yLabels = [];
    for (let i = 0; i <= 4; i++) {
      const value = adjustedMin + (adjustedRange * (4 - i)) / 4;
      yLabels.push(Math.round(value));
    }

    return (
      <div className={styles.lineChart}>
        <svg width="100%" height="280" viewBox="0 0 500 280">
          <defs>
            <linearGradient
              id={`gradient-${metric}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
            </filter>
          </defs>

          {/* Background */}
          <rect x="0" y="0" width="500" height="280" fill="#fafafa" rx="8" />

          {/* Grid lines horizontal */}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={`h-${i}`}>
              <line
                x1="60"
                y1={50 + i * 40}
                x2="450"
                y2={50 + i * 40}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <text
                x="50"
                y={50 + i * 40 + 4}
                textAnchor="end"
                fontSize="11"
                fill="#64748b"
                fontWeight="500"
              >
                {yLabels[i]}
              </text>
            </g>
          ))}

          {/* Grid lines vertical */}
          {data.map((item, i) => (
            <line
              key={`v-${i}`}
              x1={80 + i * 60}
              y1="50"
              x2={80 + i * 60}
              y2="210"
              stroke="#f1f5f9"
              strokeWidth="1"
            />
          ))}

          {/* Area fill */}
          <polygon
            points={`${data
              .map(
                (item, i) =>
                  `${80 + i * 60},${
                    210 - ((item[metric] - adjustedMin) / adjustedRange) * 160
                  }`
              )
              .join(" ")},${80 + (data.length - 1) * 60},210 80,210`}
            fill={`url(#gradient-${metric})`}
          />

          {/* Data line */}
          <polyline
            points={data
              .map(
                (item, i) =>
                  `${80 + i * 60},${
                    210 - ((item[metric] - adjustedMin) / adjustedRange) * 160
                  }`
              )
              .join(" ")}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#shadow)"
          />

          {/* Data points */}
          {data.map((item, i) => {
            const x = 80 + i * 60;
            const y =
              210 - ((item[metric] - adjustedMin) / adjustedRange) * 160;

            return (
              <g key={`point-${i}`}>
                {/* Outer glow */}
                <circle cx={x} cy={y} r="8" fill="#3b82f6" fillOpacity="0.2" />
                {/* Main point */}
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#ffffff"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  filter="url(#shadow)"
                  className={styles.dataPoint}
                />
                {/* Value tooltip on hover */}
                <g className={styles.tooltip} opacity="0">
                  <rect
                    x={x - 25}
                    y={y - 35}
                    width="50"
                    height="25"
                    rx="4"
                    fill="#1f2937"
                    fillOpacity="0.9"
                  />
                  <text
                    x={x}
                    y={y - 18}
                    textAnchor="middle"
                    fontSize="12"
                    fill="white"
                    fontWeight="600"
                  >
                    {item[metric]}
                  </text>
                </g>
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.map((item, i) => (
            <text
              key={`label-${i}`}
              x={80 + i * 60}
              y={235}
              textAnchor="middle"
              fontSize="12"
              fill="#64748b"
              fontWeight="600"
            >
              {item?.month}
            </text>
          ))}

          {/* Chart title based on metric */}
          <text
            x="250"
            y="25"
            textAnchor="middle"
            fontSize="14"
            fill="#374151"
            fontWeight="700"
          >
            {metric === "collections" && "Numero Conferimenti"}
            {metric === "efficiency" && "Efficienza Sistema (%)"}
            {metric === "users" && "Utenti Attivi"}
            {metric === "downtime" && "Downtime (ore)"}
          </text>

          {/* Y-axis title */}
          <text
            x="20"
            y="140"
            textAnchor="middle"
            fontSize="11"
            fill="#64748b"
            fontWeight="600"
            transform="rotate(-90, 20, 140)"
          >
            {metric === "collections" && "Conferimenti"}
            {metric === "efficiency" && "%"}
            {metric === "users" && "Utenti"}
            {metric === "downtime" && "Ore"}
          </text>
        </svg>
      </div>
    );
  };

  const DonutChart = ({ data, size = 200 }) => {
    const radius = 70;
    const innerRadius = 45;
    const centerX = size / 2;
    const centerY = size / 2;

    let cumulativePercentage = 0;

    return (
      <div className={styles.donutChart}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {data.map((item, index) => {
            const startAngle = cumulativePercentage * 3.6 - 90;
            const endAngle =
              (cumulativePercentage + item?.percentage) * 3.6 - 90;
            const largeArcFlag = item?.percentage > 50 ? 1 : 0;

            const x1 =
              centerX + radius * Math.cos((startAngle * Math.PI) / 180);
            const y1 =
              centerY + radius * Math.sin((startAngle * Math.PI) / 180);
            const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
            const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

            const ix1 =
              centerX + innerRadius * Math.cos((startAngle * Math.PI) / 180);
            const iy1 =
              centerY + innerRadius * Math.sin((startAngle * Math.PI) / 180);
            const ix2 =
              centerX + innerRadius * Math.cos((endAngle * Math.PI) / 180);
            const iy2 =
              centerY + innerRadius * Math.sin((endAngle * Math.PI) / 180);

            const pathData = [
              `M ${ix1} ${iy1}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `L ${ix2} ${iy2}`,
              `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1}`,
              "Z",
            ].join(" ");

            cumulativePercentage += item?.percentage;

            return (
              <path
                key={index}
                d={pathData}
                fill={item?.color}
                className={styles.donutSlice}
              />
            );
          })}

          <circle cx={centerX} cy={centerY} r={innerRadius} fill="white" />

          <text
            x={centerX}
            y={centerY - 5}
            textAnchor="middle"
            fontSize="20"
            fontWeight="bold"
            fill="var(--gray-900)"
          >
            156.7
          </text>
          <text
            x={centerX}
            y={centerY + 15}
            textAnchor="middle"
            fontSize="12"
            fill="var(--gray-600)"
          >
            ton totali
          </text>
        </svg>
      </div>
    );
  };

  return (
    <div className={styles.reportsContainer}>
      {/* Header */}
      <div className={styles.reportsHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.titleSection}>
            <h1>Analytics Reports</h1>
            <p>Report avanzati e analisi dettagliate del sistema di raccolta</p>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.headerControls}>
            <div className={styles.searchBox}>
              <Search size={16} />
              <input type="text" placeholder="Cerca report..." />
            </div>

            <select
              className={styles.dateRangeSelect}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7d">Ultimi 7 giorni</option>
              <option value="30d">Ultimi 30 giorni</option>
              <option value="90d">Ultimi 3 mesi</option>
              <option value="1y">Ultimo anno</option>
            </select>

            <button className={styles.refreshBtn}>
              <RefreshCw size={16} />
            </button>

            <div className={styles.exportDropdown}>
              <button className={styles.exportBtn} disabled={isExporting}>
                <Download size={16} />
                {isExporting ? "Esportando..." : "Esporta"}
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Navigation */}
      <div className={styles.reportNav}>
        {reportTypes.map((report) => (
          <button
            key={report.id}
            className={`${styles.reportNavItem} ${
              selectedReport === report.id ? styles.active : ""
            }`}
            onClick={() => setSelectedReport(report.id)}
          >
            {report.icon}
            <span>{report.name}</span>
          </button>
        ))}
      </div>

      {/* Key Metrics Overview */}
      <div className={styles.metricsOverview}>
        <div className={styles.sectionHeader}>
          <h2>Metriche Chiave</h2>
          <div className={styles.metricsFilters}>
            <button className={styles.metricFilter}>
              <Target size={16} />
              vs Obiettivi
            </button>
            <button className={styles.metricFilter}>
              <TrendingUp size={16} />
              Trend
            </button>
          </div>
        </div>

        <div className={styles.metricsGrid}>
          {keyMetrics.map((metric, index) => (
            <div key={index} className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <h3>{metric.title}</h3>
                <div
                  className={`${styles.metricTrend} ${styles[metric.trend]}`}
                >
                  {metric.trend === "up" ? (
                    <ArrowUp size={16} />
                  ) : (
                    <ArrowDown size={16} />
                  )}
                  {metric.change}
                </div>
              </div>

              <div className={styles.metricValue}>
                <span className={styles.currentValue}>{metric.current}</span>
                <span className={styles.previousValue}>
                  da {metric.previous}
                </span>
              </div>

              <div className={styles.metricProgress}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${metric.progress}%` }}
                  ></div>
                </div>
                <div className={styles.progressLabels}>
                  <span>Obiettivo: {metric.target}</span>
                  <span>{metric.progress.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.reportsGrid}>
        {/* Performance Chart */}
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>
              <LineChart size={20} />
              <h3>Trend Performance</h3>
            </div>
            <div className={styles.chartControls}>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className={styles.metricSelect}
              >
                <option value="collections">Conferimenti</option>
                <option value="efficiency">Efficienza</option>
                <option value="users">Utenti</option>
                <option value="downtime">Downtime</option>
              </select>
            </div>
          </div>
          <div className={styles.chartContent}>
            <LineChartComponent
              data={performanceData}
              metric={selectedMetric}
            />
          </div>
        </div>

        {/* Waste Analysis */}
        <div className={styles.wasteAnalysisSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <PieChart size={20} />
              <h3>Analisi Rifiuti</h3>
            </div>
          </div>

          <div className={styles.wasteContent}>
            <DonutChart data={wasteAnalysis.byType} />

            <div className={styles.wasteBreakdown}>
              {wasteAnalysis.byType.map((item, index) => (
                <div key={index} className={styles.wasteItem}>
                  <div className={styles.wasteItemInfo}>
                    <div
                      className={styles.wasteColor}
                      style={{ backgroundColor: item?.color }}
                    ></div>
                    <div className={styles.wasteDetails}>
                      <span className={styles.wasteType}>{item?.type}</span>
                      <span className={styles.wasteAmount}>
                        {item?.amount} ton
                      </span>
                    </div>
                  </div>
                  <div className={styles.wasteStats}>
                    <span className={styles.wastePercentage}>
                      {item?.percentage}%
                    </span>
                    <span
                      className={`${styles.wasteTrend} ${
                        item?.trend.startsWith("+")
                          ? styles.positive
                          : styles.negative
                      }`}
                    >
                      {item?.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Devices Performance */}
        <div className={styles.topDevicesSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Award size={20} />
              <h3>Top Performance Dispositivi</h3>
            </div>
            <button className={styles.viewAllBtn}>
              Vedi tutti
              <ChevronRight size={16} />
            </button>
          </div>

          <div className={styles.devicesTable}>
            <div className={styles.tableHeader}>
              <div className={styles.tableHeaderCell}>Dispositivo</div>
              <div className={styles.tableHeaderCell}>Efficienza</div>
              <div className={styles.tableHeaderCell}>Uptime</div>
              <div className={styles.tableHeaderCell}>Revenue</div>
              <div className={styles.tableHeaderCell}>Azioni</div>
            </div>

            {topDevices.map((device, index) => (
              <div key={device.id} className={styles.tableRow}>
                <div className={styles.deviceInfo}>
                  <div className={styles.deviceRank}>#{index + 1}</div>
                  <div className={styles.deviceDetails}>
                    <span className={styles.deviceId}>{device.id}</span>
                    <span className={styles.deviceLocation}>
                      {device.location}
                    </span>
                  </div>
                </div>

                <div className={styles.efficiencyCell}>
                  <div className={styles.efficiencyBar}>
                    <div
                      className={styles.efficiencyFill}
                      style={{ width: `${device.efficiency}%` }}
                    ></div>
                  </div>
                  <span>{device.efficiency}%</span>
                </div>

                <div className={styles.uptimeCell}>
                  <span className={styles.uptimeValue}>{device.uptime}%</span>
                  <span className={styles.uptimeLabel}>
                    ({device.collections} conf.)
                  </span>
                </div>

                <div className={styles.revenueCell}>
                  <span className={styles.revenueValue}>{device.revenue}</span>
                </div>

                <div className={styles.actionsCell}>
                  <button className={styles.actionBtn}>
                    <Eye size={14} />
                  </button>
                  <button className={styles.actionBtn}>
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location Analysis */}
        <div className={styles.locationAnalysisSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <BarChart3 size={20} />
              <h3>Analisi per Zona</h3>
            </div>
          </div>

          <div className={styles.locationGrid}>
            {wasteAnalysis.byLocation.map((location, index) => (
              <div key={index} className={styles.locationCard}>
                <div className={styles.locationHeader}>
                  <h4>{location.area}</h4>
                  <span className={styles.locationDevices}>
                    {location.devices} dispositivi
                  </span>
                </div>

                <div className={styles.locationMetrics}>
                  <div className={styles.locationMetric}>
                    <span className={styles.metricLabel}>Volume</span>
                    <span className={styles.metricValue}>
                      {location.amount} ton
                    </span>
                  </div>
                  <div className={styles.locationMetric}>
                    <span className={styles.metricLabel}>
                      Riempimento Medio
                    </span>
                    <span className={styles.metricValue}>
                      {location.avgFill}%
                    </span>
                  </div>
                </div>

                <div className={styles.locationProgress}>
                  <div
                    className={styles.locationProgressBar}
                    style={{ width: `${location.avgFill}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Impact */}
        <div className={styles.environmentalSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Award size={20} />
              <h3>Impatto Ambientale</h3>
            </div>
          </div>

          <div className={styles.environmentalGrid}>
            <div className={styles.environmentalCard}>
              <div className={styles.environmentalIcon}>🌱</div>
              <div className={styles.environmentalContent}>
                <h4>CO₂ Risparmiata</h4>
                <div className={styles.environmentalValue}>
                  <span>{environmentalImpact.co2Saved.value}</span>
                  <span className={styles.environmentalUnit}>
                    {environmentalImpact.co2Saved.unit}
                  </span>
                </div>
                <div className={styles.environmentalChange}>
                  {environmentalImpact.co2Saved.change}
                </div>
              </div>
            </div>

            <div className={styles.environmentalCard}>
              <div className={styles.environmentalIcon}>♻️</div>
              <div className={styles.environmentalContent}>
                <h4>Tasso Riciclaggio</h4>
                <div className={styles.environmentalValue}>
                  <span>{environmentalImpact.recyclingRate.value}</span>
                  <span className={styles.environmentalUnit}>
                    {environmentalImpact.recyclingRate.unit}
                  </span>
                </div>
                <div className={styles.environmentalChange}>
                  {environmentalImpact.recyclingRate.change}
                </div>
              </div>
            </div>

            <div className={styles.environmentalCard}>
              <div className={styles.environmentalIcon}>⚡</div>
              <div className={styles.environmentalContent}>
                <h4>Energia Risparmiata</h4>
                <div className={styles.environmentalValue}>
                  <span>{environmentalImpact.energySaved.value}</span>
                  <span className={styles.environmentalUnit}>
                    {environmentalImpact.energySaved.unit}
                  </span>
                </div>
                <div className={styles.environmentalChange}>
                  {environmentalImpact.energySaved.change}
                </div>
              </div>
            </div>

            <div className={styles.environmentalCard}>
              <div className={styles.environmentalIcon}>💧</div>
              <div className={styles.environmentalContent}>
                <h4>Acqua Risparmiata</h4>
                <div className={styles.environmentalValue}>
                  <span>{environmentalImpact.waterSaved.value}</span>
                  <span className={styles.environmentalUnit}>
                    {environmentalImpact.waterSaved.unit}
                  </span>
                </div>
                <div className={styles.environmentalChange}>
                  {environmentalImpact.waterSaved.change}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scheduled Reports */}
        <div className={styles.scheduledReportsSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Clock size={20} />
              <h3>Report Programmati</h3>
            </div>
            <button className={styles.addReportBtn}>
              <Plus size={16} />
              Nuovo Report
            </button>
          </div>

          <div className={styles.scheduledList}>
            {scheduledReports.map((report) => (
              <div key={report.id} className={styles.scheduledItem}>
                <div className={styles.reportInfo}>
                  <div className={styles.reportName}>{report.name}</div>
                  <div className={styles.reportMeta}>
                    <span className={styles.reportSchedule}>
                      {report.schedule}
                    </span>
                    <span className={styles.reportRecipients}>
                      {report.recipients} destinatari
                    </span>
                    <span className={styles.reportLastSent}>
                      Ultimo: {report.lastSent}
                    </span>
                  </div>
                </div>

                <div className={styles.reportActions}>
                  <span
                    className={`${styles.reportStatus} ${
                      styles[report.status]
                    }`}
                  >
                    {report.status === "active" ? "Attivo" : "In Pausa"}
                  </span>
                  <div className={styles.reportButtons}>
                    <button className={styles.actionBtn}>
                      <Edit size={14} />
                    </button>
                    <button className={styles.actionBtn}>
                      <Mail size={14} />
                    </button>
                    <button className={styles.actionBtn}>
                      <Settings size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;
