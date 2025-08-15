import React from 'react';
import { Package, TrendingUp, AlertTriangle, Plus, BarChart3, ArrowUp } from 'lucide-react';

import styles from './Products.module.scss';
import CircularProgress from '../shared/CircularProgress';

interface CategoryData {
  name: string;
  sales: number;
  stock: number;
  growth: string;
  status: 'high' | 'medium' | 'low' | 'critical';
}

interface CategoryStats {
  totalCategories: number;
  topSelling: number;
  lowStock: number;
  newArrivals: number;
  byCategory: CategoryData[];
}

interface ProductsOverviewProps {
  categoryStats?: CategoryStats;
  loading?: boolean;
}

const ProductsOverview: React.FC<ProductsOverviewProps> = ({
  categoryStats,
  loading = false
}) => {
  const defaultStats: CategoryStats = {
    totalCategories: 8,
    topSelling: 6,
    lowStock: 3,
    newArrivals: 15,
    byCategory: [
      { name: "Cibo Cani", sales: 1200, stock: 850, growth: "+15%", status: "high" },
      { name: "Cibo Gatti", sales: 980, stock: 620, growth: "+8%", status: "medium" },
      { name: "Giocattoli", sales: 450, stock: 780, growth: "+23%", status: "high" },
      { name: "Accessori", sales: 380, stock: 340, growth: "+5%", status: "low" },
      { name: "Cucce e Trasportini", sales: 290, stock: 180, growth: "+12%", status: "medium" },
      { name: "Igiene e Cura", sales: 420, stock: 95, growth: "+18%", status: "critical" }
    ]
  };

  const stats = categoryStats || defaultStats;

  const getStatusColor = (status: CategoryData['status']) => {
    switch (status) {
      case 'high':
        return 'var(--success-color)';
      case 'medium':
        return 'var(--warning-color)';
      case 'low':
        return 'var(--orange-color)';
      case 'critical':
        return 'var(--error-color)';
      default:
        return 'var(--gray-400)';
    }
  };

  const getStatusLabel = (status: CategoryData['status']) => {
    switch (status) {
      case 'high':
        return 'Ottimo';
      case 'medium':
        return 'Buono';
      case 'low':
        return 'Basso';
      case 'critical':
        return 'Critico';
      default:
        return 'N/A';
    }
  };

  const totalSales = stats.byCategory.reduce((sum, cat) => sum + cat.sales, 0);
  const averageStock = Math.round(stats.byCategory.reduce((sum, cat) => sum + cat.stock, 0) / stats.byCategory.length);

  if (loading) {
    return (
      <div className={styles.productsOverview}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <Package size={20} />
            <h2>Panoramica Prodotti</h2>
          </div>
        </div>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}>Caricamento...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.productsOverview}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <Package size={20} />
          <h2>Panoramica Prodotti</h2>
          <div className={styles.categoryBadge}>
            <span>{stats.totalCategories} categorie</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.addBtn}>
            <Plus size={16} />
            Nuovo Prodotto
          </button>
          <button className={styles.analyticsBtn}>
            <BarChart3 size={16} />
            Analytics
          </button>
        </div>
      </div>

      <div className={styles.overviewContent}>
        {/* Summary Cards */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              <Package size={24} />
            </div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryValue}>{totalSales.toLocaleString()}</div>
              <div className={styles.summaryLabel}>Vendite Totali</div>
              <div className={styles.summaryGrowth}>
                <ArrowUp size={12} />
                +12.5% vs mese scorso
              </div>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              <TrendingUp size={24} />
            </div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryValue}>{averageStock}</div>
              <div className={styles.summaryLabel}>Stock Medio</div>
              <div className={styles.summaryGrowth}>
                <ArrowUp size={12} />
                +8.2% rispetto al target
              </div>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              <AlertTriangle size={24} />
            </div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryValue}>{stats.lowStock}</div>
              <div className={styles.summaryLabel}>Stock Basso</div>
              <div className={styles.summaryAlert}>
                Richiede attenzione
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Performance Circle */}
          <div className={styles.performanceCard}>
            <div className={styles.performanceHeader}>
              <h3>Performance Categorie</h3>
              <span className={styles.performanceSubtitle}>
                {stats.topSelling}/{stats.totalCategorie} categorie top performer
              </span>
            </div>
            <div className={styles.performanceChart}>
              <CircularProgress 
                percentage={Math.round((stats.topSelling / stats.totalCategories) * 100)} 
                size={120}
                color="var(--primary-color)"
              />
              <div className={styles.performanceStats}>
                <div className={styles.performanceStat}>
                  <span className={styles.statValue}>{stats.newArrivals}</span>
                  <span className={styles.statLabel}>Nuovi Arrivi</span>
                </div>
                <div className={styles.performanceStat}>
                  <span className={styles.statValue}>{stats.topSelling}</span>
                  <span className={styles.statLabel}>Top Performer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Categories List */}
          <div className={styles.categoriesList}>
            <div className={styles.categoriesHeader}>
              <h3>Dettaglio per Categoria</h3>
              <button className={styles.sortBtn}>
                <BarChart3 size={14} />
                Ordina per vendite
              </button>
            </div>
            
            <div className={styles.categoriesGrid}>
              {stats.byCategory.map((category, index) => (
                <div key={index} className={styles.categoryCard}>
                  <div className={styles.categoryHeader}>
                    <div className={styles.categoryInfo}>
                      <Package size={16} />
                      <span className={styles.categoryName}>{category.name}</span>
                    </div>
                    <div 
                      className={styles.statusIndicator}
                      style={{ backgroundColor: getStatusColor(category.status) }}
                      title={getStatusLabel(category.status)}
                    ></div>
                  </div>
                  
                  <div className={styles.categoryMetrics}>
                    <div className={styles.categoryMetric}>
                      <span className={styles.metricValue}>{category.sales.toLocaleString()}</span>
                      <span className={styles.metricLabel}>Vendite</span>
                    </div>
                    <div className={styles.categoryMetric}>
                      <span className={styles.metricValue}>{category.stock}</span>
                      <span className={styles.metricLabel}>In Stock</span>
                    </div>
                  </div>

                  <div className={styles.categoryFooter}>
                    <div className={styles.categoryGrowth}>
                      <TrendingUp size={12} />
                      <span>{category.growth}</span>
                    </div>
                    <div className={styles.stockProgress}>
                      <div 
                        className={styles.stockProgressFill}
                        style={{ 
                          width: `${Math.min((category.stock / 1000) * 100, 100)}%`,
                          backgroundColor: getStatusColor(category.status)
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <h3>Azioni Rapide</h3>
          <div className={styles.actionsList}>
            <button className={styles.actionBtn}>
              <AlertTriangle size={16} />
              <span>Controlla Stock Bassi</span>
            </button>
            <button className={styles.actionBtn}>
              <Plus size={16} />
              <span>Aggiungi Categoria</span>
            </button>
            <button className={styles.actionBtn}>
              <BarChart3 size={16} />
              <span>Report Vendite</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsOverview;