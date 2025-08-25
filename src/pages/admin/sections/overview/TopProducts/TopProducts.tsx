import React, { useState } from 'react';
import { TrendingUp, ChevronRight, Package, Star, Eye, Filter, Award } from 'lucide-react';
import styles from './TopProducts.module.scss';

interface Product {
  name: string;
  category: string;
  sales: number;
  revenue: string;
  rating: number;
  image?: string;
  growth?: string;
  badge?: string;
}

interface TopProductsProps {
  products?: Product[];
  maxItems?: number;
  sortBy?: 'sales' | 'revenue' | 'rating';
}

const TopProducts: React.FC<TopProductsProps> = ({
  products,
  maxItems = 5,
  sortBy = 'sales'
}) => {
  const [currentSort, setCurrentSort] = useState(sortBy);
  const [showAll, setShowAll] = useState(false);

  const defaultProducts: Product[] = [
    { 
      name: "Royal Canin Adult", 
      category: "Cibo Cani", 
      sales: 234, 
      revenue: "€8,945", 
      rating: 4.8,
      growth: "+15%",
      badge: "Bestseller"
    },
    { 
      name: "Whiskas Indoor", 
      category: "Cibo Gatti", 
      sales: 189, 
      revenue: "€4,567", 
      rating: 4.6,
      growth: "+8%"
    },
    { 
      name: "Kong Classic", 
      category: "Giocattoli", 
      sales: 156, 
      revenue: "€2,890", 
      rating: 4.9,
      growth: "+23%",
      badge: "Top Rated"
    },
    { 
      name: "Collare GPS SmartPet", 
      category: "Accessori", 
      sales: 98, 
      revenue: "€3,920", 
      rating: 4.5,
      growth: "+31%",
      badge: "Trending"
    },
    { 
      name: "Hill's Science Diet", 
      category: "Cibo Cani", 
      sales: 87, 
      revenue: "€3,480", 
      rating: 4.7,
      growth: "+12%"
    },
    { 
      name: "Purina Pro Plan", 
      category: "Cibo Gatti", 
      sales: 76, 
      revenue: "€2,890", 
      rating: 4.4,
      growth: "+7%"
    },
    { 
      name: "FURminator deShedding", 
      category: "Igiene", 
      sales: 65, 
      revenue: "€2,145", 
      rating: 4.6,
      growth: "+19%"
    }
  ];

  const productList = products || defaultProducts;
  
  const sortedProducts = [...productList].sort((a, b) => {
    switch (currentSort) {
      case 'sales':
        return b.sales - a.sales;
      case 'revenue':
        return parseFloat(b.revenue.replace('€', '').replace(',', '')) - 
               parseFloat(a.revenue.replace('€', '').replace(',', ''));
      case 'rating':
        return b.rating - a.rating;
      default:
        return b.sales - a.sales;
    }
  });

  const displayProducts = showAll ? sortedProducts : sortedProducts.slice(0, maxItems);

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Bestseller':
        return 'var(--success-color)';
      case 'Top Rated':
        return 'var(--warning-color)';
      case 'Trending':
        return 'var(--primary-color)';
      default:
        return 'var(--gray-400)';
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Cibo')) return '🍖';
    if (category.includes('Giocattoli')) return '🎾';
    if (category.includes('Accessori')) return '🎀';
    if (category.includes('Igiene')) return '🧼';
    return '📦';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < Math.floor(rating) ? styles.starFilled : styles.starEmpty}
      />
    ));
  };

  return (
    <div className={styles.topProductsCard}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <TrendingUp size={20} />
          <h2>Top Prodotti</h2>
          <div className={styles.metricsPreview}>
            <Eye size={14} />
            <span>{productList.length} prodotti</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.sortSelector}>
            <Filter size={14} />
            <select 
              value={currentSort} 
              onChange={(e) => setCurrentSort(e.target.value as 'sales' | 'revenue' | 'rating')}
              className={styles.sortSelect}
            >
              <option value="sales">Vendite</option>
              <option value="revenue">Ricavi</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          <button className={styles.sectionAction} onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Mostra meno' : 'Vedi tutti'}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className={styles.productsStats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>
            €{sortedProducts.reduce((sum, p) => sum + parseFloat(p.revenue.replace('€', '').replace(',', '')), 0).toLocaleString()}
          </span>
          <span className={styles.statLabel}>Ricavi Totali</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>
            {(sortedProducts.reduce((sum, p) => sum + p.rating, 0) / sortedProducts.length).toFixed(1)}
          </span>
          <span className={styles.statLabel}>Rating Medio</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>
            {sortedProducts.reduce((sum, p) => sum + p.sales, 0).toLocaleString()}
          </span>
          <span className={styles.statLabel}>Vendite Totali</span>
        </div>
      </div>

      <div className={styles.productsList}>
        {displayProducts.map((product, index) => (
          <div key={index} className={styles.productItem}>
            <div className={styles.productRank}>
              #{index + 1}
              {index < 3 && (
                <div className={styles.rankBadge}>
                  <Award size={10} />
                </div>
              )}
            </div>
            
            <div className={styles.productImage}>
              <span className={styles.categoryEmoji}>
                {getCategoryIcon(product.category)}
              </span>
            </div>
            
            <div className={styles.productDetails}>
              <div className={styles.productHeader}>
                <div className={styles.productNameSection}>
                  <span className={styles.productName}>{product.name}</span>
                  {product.badge && (
                    <span 
                      className={styles.productBadge}
                      style={{ 
                        backgroundColor: `${getBadgeColor(product.badge)}20`,
                        color: getBadgeColor(product.badge)
                      }}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>
                <span className={styles.productRevenue}>{product.revenue}</span>
              </div>
              
              <div className={styles.productMeta}>
                <div className={styles.productCategory}>
                  <Package size={12} />
                  <span>{product.category}</span>
                </div>
                <div className={styles.productRating}>
                  <div className={styles.stars}>
                    {renderStars(product.rating)}
                  </div>
                  <span className={styles.ratingValue}>{product.rating}</span>
                </div>
              </div>
              
              <div className={styles.productFooter}>
                <div className={styles.salesInfo}>
                  <span className={styles.salesCount}>{product.sales} vendite</span>
                  {product.growth && (
                    <span className={styles.growthIndicator}>
                      <TrendingUp size={10} />
                      {product.growth}
                    </span>
                  )}
                </div>
                <div className={styles.productActions}>
                  <button className={styles.actionBtn} title="Visualizza dettagli">
                    <Eye size={12} />
                  </button>
                  <button className={styles.actionBtn} title="Modifica prodotto">
                    <Package size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!showAll && productList.length > maxItems && (
        <div className={styles.showMoreSection}>
          <div className={styles.hiddenCount}>
            +{productList.length - maxItems} prodotti nascosti
          </div>
          <button 
            className={styles.showMoreBtn}
            onClick={() => setShowAll(true)}
          >
            Mostra tutti i prodotti
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      <div className={styles.cardFooter}>
        <div className={styles.footerInfo}>
          <span className={styles.lastUpdate}>Aggiornato 5 min fa</span>
        </div>
        <div className={styles.footerActions}>
          <button className={styles.exportBtn}>
            Esporta Lista
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopProducts;