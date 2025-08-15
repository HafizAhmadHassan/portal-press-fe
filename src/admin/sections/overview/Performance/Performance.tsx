import React from 'react';
import { BarChart3, Filter, Calendar, TrendingUp } from 'lucide-react';
import styles from './Performance.module.scss';

interface PerformanceData {
  month: string;
  vendite: number;
  donazioni: number;
  ordini: number;
}

interface PerformanceChartProps {
  data?: PerformanceData[];
  showLegend?: boolean;
  height?: number;
  loading?: boolean;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  showLegend = true,
  height = 200,
  loading = false
}) => {
  const defaultData: PerformanceData[] = [
    { month: "Gen", vendite: 38000, donazioni: 5200, ordini: 1240 },
    { month: "Feb", vendite: 32000, donazioni: 4800, ordini: 1180 },
    { month: "Mar", vendite: 42000, donazioni: 6100, ordini: 1450 },
    { month: "Apr", vendite: 39000, donazioni: 5900, ordini: 1320 },
    { month: "Mag", vendite: 48000, donazioni: 7200, ordini: 1680 },
    { month: "Giu", vendite: 45000, donazioni: 6800, ordini: 1520 }
  ];

  const chartData = data || defaultData;
  const maxVendite = Math.max(...chartData.map(d => d.vendite));
  const maxDonazioni = Math.max(...chartData.map(d => d.donazioni));
  const maxOrdini = Math.max(...chartData.map(d => d.ordini));

  if (loading) {
    return (
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div className={styles.chartTitle}>
            <BarChart3 size={20} />
            <h3>Performance Mensile</h3>
          </div>
        </div>
        <div className={styles.chartContent}>
          <div className={styles.loadingSpinner}>Caricamento...</div>
        </div>
      </div>
    );
  }

  const calculateGrowth = () => {
    if (chartData.length < 2) return 0;
    const current = chartData[chartData.length - 1].vendite;
    const previous = chartData[chartData.length - 2].vendite;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitle}>
          <BarChart3 size={20} />
          <h3>Performance Mensile</h3>
          <div className={styles.chartGrowth}>
            <TrendingUp size={16} />
            <span>+{calculateGrowth()}% vs mese scorso</span>
          </div>
        </div>
        <div className={styles.chartActions}>
          <button className={styles.chartBtn} title="Filtri">
            <Filter size={16} />
          </button>
          <button className={styles.chartBtn} title="Calendario">
            <Calendar size={16} />
          </button>
        </div>
      </div>

      <div className={styles.chartContent}>
        {showLegend && (
          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <div 
                className={styles.legendColor} 
                style={{ backgroundColor: 'var(--primary-color)' }}
              ></div>
              <span>Vendite (€)</span>
            </div>
            <div className={styles.legendItem}>
              <div 
                className={styles.legendColor} 
                style={{ backgroundColor: 'var(--success-color)' }}
              ></div>
              <span>Donazioni (€)</span>
            </div>
            <div className={styles.legendItem}>
              <div 
                className={styles.legendColor} 
                style={{ backgroundColor: 'var(--warning-color)' }}
              ></div>
              <span>Ordini (#)</span>
            </div>
          </div>
        )}

        <div className={styles.barChart} style={{ height: `${height}px` }}>
          {chartData.map((data, index) => (
            <div key={index} className={styles.barGroup}>
              <div className={styles.barContainer}>
                <div
                  className={`${styles.bar} ${styles.barVendite}`}
                  style={{
                    height: `${(data.vendite / maxVendite) * (height - 40)}px`,
                  }}
                  title={`Vendite: €${data.vendite.toLocaleString()}`}
                >
                  <div className={styles.barTooltip}>
                    €{(data.vendite / 1000).toFixed(0)}k
                  </div>
                </div>
                <div
                  className={`${styles.bar} ${styles.barDonazioni}`}
                  style={{
                    height: `${(data.donazioni / maxDonazioni) * (height - 40)}px`,
                  }}
                  title={`Donazioni: €${data.donazioni.toLocaleString()}`}
                >
                  <div className={styles.barTooltip}>
                    €{(data.donazioni / 1000).toFixed(1)}k
                  </div>
                </div>
                <div
                  className={`${styles.bar} ${styles.barOrdini}`}
                  style={{
                    height: `${(data.ordini / maxOrdini) * (height - 40)}px`,
                  }}
                  title={`Ordini: ${data.ordini}`}
                >
                  <div className={styles.barTooltip}>
                    {data.ordini}
                  </div>
                </div>
              </div>
              <span className={styles.barLabel}>{data.month}</span>
            </div>
          ))}
        </div>

        <div className={styles.chartSummary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Vendite Totali</span>
            <span className={styles.summaryValue}>
              €{chartData.reduce((sum, d) => sum + d.vendite, 0).toLocaleString()}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Donazioni Totali</span>
            <span className={styles.summaryValue}>
              €{chartData.reduce((sum, d) => sum + d.donazioni, 0).toLocaleString()}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Ordini Totali</span>
            <span className={styles.summaryValue}>
              {chartData.reduce((sum, d) => sum + d.ordini, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;