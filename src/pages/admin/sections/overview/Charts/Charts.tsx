import React, { useState } from 'react';
import { PieChart, Eye, TrendingUp } from 'lucide-react';
import styles from './Charts.module.scss';

interface ProductCategory {
  type: string;
  percentage: number;
  color: string;
  revenue: string;
}

interface CategoryChartProps {
  categories?: ProductCategory[];
  showLabels?: boolean;
  size?: number;
  loading?: boolean;
}

const CategoryChart: React.FC<CategoryChartProps> = ({
  categories,
  showLabels = true,
  size = 200,
  loading = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const defaultCategories: ProductCategory[] = [
    { type: "CIBO CANI", percentage: 42, color: "#f59e0b", revenue: "€19.8k" },
    { type: "CIBO GATTI", percentage: 28, color: "#3b82f6", revenue: "€13.2k" },
    { type: "GIOCATTOLI", percentage: 18, color: "#10b981", revenue: "€8.5k" },
    { type: "ACCESSORI", percentage: 12, color: "#8b5cf6", revenue: "€5.7k" }
  ];

  const chartCategories = categories || defaultCategories;
  const totalRevenue = chartCategories.reduce((sum, cat) => {
    const revenue = parseFloat(cat.revenue.replace('€', '').replace('k', '')) * 1000;
    return sum + revenue;
  }, 0);

  if (loading) {
    return (
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div className={styles.chartTitle}>
            <PieChart size={20} />
            <h3>Vendite per Categoria</h3>
          </div>
        </div>
        <div className={styles.chartContent}>
          <div className={styles.loadingSpinner}>Caricamento...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitle}>
          <PieChart size={20} />
          <h3>Vendite per Categoria</h3>
          <div className={styles.chartBadge}>
            <Eye size={14} />
            <span>Questo mese</span>
          </div>
        </div>
        <div className={styles.chartActions}>
          <button className={styles.viewDetailsBtn}>
            <TrendingUp size={16} />
            Dettagli
          </button>
        </div>
      </div>

      <div className={styles.pieChartContainer}>
        <div className={styles.pieChart}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {chartCategories.map((category, index) => {
              const radius = (size - 40) / 2;
              const centerX = size / 2;
              const centerY = size / 2;
              const circumference = 2 * Math.PI * radius;
              const strokeDasharray = `${(category.percentage / 100) * circumference} ${circumference}`;
              const rotation = chartCategories
                .slice(0, index)
                .reduce((sum, cat) => sum + (cat.percentage / 100) * 360, 0);

              return (
                <g key={index}>
                  <circle
                    cx={centerX}
                    cy={centerY}
                    r={radius}
                    fill="none"
                    stroke={category.color}
                    strokeWidth={selectedCategory === index ? "20" : "16"}
                    strokeDasharray={strokeDasharray}
                    transform={`rotate(${rotation - 90} ${centerX} ${centerY})`}
                    className={styles.pieSlice}
                    onMouseEnter={() => setSelectedCategory(index)}
                    onMouseLeave={() => setSelectedCategory(null)}
                    style={{
                      opacity: selectedCategory !== null && selectedCategory !== index ? 0.6 : 1,
                      filter: selectedCategory === index ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none'
                    }}
                  />
                  {selectedCategory === index && (
                    <text
                      x={centerX}
                      y={centerY - 10}
                      textAnchor="middle"
                      className={styles.pieSliceLabel}
                      fill={category.color}
                    >
                      <tspan x={centerX} dy="0" fontSize="14" fontWeight="600">
                        {category.percentage}%
                      </tspan>
                      <tspan x={centerX} dy="16" fontSize="12">
                        {category.revenue}
                      </tspan>
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          
          <div className={styles.pieCenter}>
            <span className={styles.pieTotal}>€{(totalRevenue / 1000).toFixed(1)}k</span>
            <span className={styles.pieLabel}>totali</span>
          </div>
        </div>

        <div className={styles.categoriesList}>
          {chartCategories.map((category, index) => (
            <div 
              key={index} 
              className={`${styles.categoryItem} ${selectedCategory === index ? styles.selected : ''}`}
              onMouseEnter={() => setSelectedCategory(index)}
              onMouseLeave={() => setSelectedCategory(null)}
            >
              <div className={styles.categoryInfo}>
                <div
                  className={styles.categoryColor}
                  style={{ backgroundColor: category.color }}
                ></div>
                <div className={styles.categoryDetails}>
                  <span className={styles.categoryName}>{category.type}</span>
                  <span className={styles.categoryGrowth}>+{(Math.random() * 10 + 5).toFixed(1)}%</span>
                </div>
              </div>
              <div className={styles.categoryStats}>
                <span className={styles.categoryRevenue}>{category.revenue}</span>
                <span className={styles.categoryPercentage}>{category.percentage}%</span>
                <div className={styles.categoryProgressBar}>
                  <div 
                    className={styles.categoryProgressFill}
                    style={{ 
                      width: `${category.percentage}%`,
                      backgroundColor: category.color 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.chartFooter}>
        <div className={styles.footerStats}>
          <div className={styles.footerStat}>
            <span className={styles.footerLabel}>Categoria Top</span>
            <span className={styles.footerValue}>
              {chartCategories.reduce((max, cat) => 
                cat.percentage > max.percentage ? cat : max
              ).type}
            </span>
          </div>
          <div className={styles.footerStat}>
            <span className={styles.footerLabel}>Crescita Media</span>
            <span className={styles.footerValue}>+8.2%</span>
          </div>
          <div className={styles.footerStat}>
            <span className={styles.footerLabel}>Prodotti Attivi</span>
            <span className={styles.footerValue}>1,247</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;