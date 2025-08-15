import React from 'react';
import { MessageCircle, Star, TrendingUp, Award, ThumbsUp, Users } from 'lucide-react';
import CircularProgress from '../shared/CircularProgress';
import styles from './Satisfactions.module.scss';

interface SatisfactionMetric {
  label: string;
  rating: number;
  percentage: number;
  trend?: string;
}

interface SatisfactionPanelProps {
  overallScore?: number;
  metrics?: SatisfactionMetric[];
  loading?: boolean;
}

const SatisfactionPanel: React.FC<SatisfactionPanelProps> = ({
  overallScore = 89,
  metrics,
  loading = false
}) => {
  const defaultMetrics: SatisfactionMetric[] = [
    { label: "Qualità Prodotti", rating: 9.2, percentage: 92, trend: "+0.3" },
    { label: "Spedizione", rating: 8.8, percentage: 88, trend: "+0.5" },
    { label: "Servizio Clienti", rating: 8.5, percentage: 85, trend: "+0.2" },
    { label: "Prezzo/Qualità", rating: 8.1, percentage: 81, trend: "+0.4" },
    { label: "Esperienza Sito", rating: 8.7, percentage: 87, trend: "+0.6" }
  ];

  const satisfactionMetrics = metrics || defaultMetrics;

  const recentReviews = [
    {
      customer: "Maria R.",
      rating: 5,
      comment: "Prodotti di ottima qualità, il mio cane adora il nuovo cibo!",
      product: "Royal Canin Adult",
      time: "2h fa"
    },
    {
      customer: "Luca B.",
      rating: 5,
      comment: "Spedizione velocissima e imballaggio perfetto.",
      product: "Kong Classic",
      time: "5h fa"
    },
    {
      customer: "Anna V.",
      rating: 4,
      comment: "Ottimo servizio clienti, molto disponibili e competenti.",
      product: "Collare GPS",
      time: "1g fa"
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'var(--success-color)';
    if (score >= 80) return 'var(--warning-color)';
    if (score >= 70) return 'var(--orange-color)';
    return 'var(--error-color)';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Eccellente';
    if (score >= 80) return 'Buono';
    if (score >= 70) return 'Discreto';
    return 'Da migliorare';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < rating ? styles.starFilled : styles.starEmpty}
      />
    ));
  };

  if (loading) {
    return (
      <div className={styles.satisfactionPanel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <MessageCircle size={20} />
            <h2>Soddisfazione Cliente</h2>
          </div>
        </div>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}>Caricamento...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.satisfactionPanel}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <MessageCircle size={20} />
          <h2>Soddisfazione Cliente</h2>
          <div className={styles.scoreBadge} style={{ color: getScoreColor(overallScore) }}>
            <Award size={14} />
            <span>{getScoreLabel(overallScore)}</span>
          </div>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.headerStat}>
            <ThumbsUp size={16} />
            <span>94.5% positivi</span>
          </div>
          <div className={styles.headerStat}>
            <Users size={16} />
            <span>1,247 recensioni</span>
          </div>
        </div>
      </div>

      <div className={styles.satisfactionContent}>
        {/* Overall Score Section */}
        <div className={styles.overallSection}>
          <div className={styles.scoreDisplay}>
            <CircularProgress 
              percentage={overallScore} 
              size={120} 
              color={getScoreColor(overallScore)}
            />
            <div className={styles.scoreInfo}>
              <h4>Score Generale</h4>
              <span className={styles.scoreValue}>{(overallScore / 10).toFixed(1)}/10</span>
              <span className={styles.scoreLabel}>{getScoreLabel(overallScore)}</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className={styles.quickStats}>
            <div className={styles.quickStat}>
              <div className={styles.statIcon}>
                <Star size={16} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>4.7</span>
                <span className={styles.statLabel}>Rating Medio</span>
              </div>
            </div>
            <div className={styles.quickStat}>
              <div className={styles.statIcon}>
                <TrendingUp size={16} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>+2.3%</span>
                <span className={styles.statLabel}>vs Mese Scorso</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid - Metrics and Reviews */}
        <div className={styles.contentGrid}>
          {/* Detailed Metrics */}
          <div className={styles.metricsSection}>
            <h3 className={styles.sectionSubtitle}>Valutazioni Dettagliate</h3>
            <div className={styles.metricsList}>
              {satisfactionMetrics.map((metric, index) => (
                <div key={index} className={styles.metricItem}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricLabel}>{metric.label}</span>
                    <div className={styles.metricScore}>
                      <span className={styles.metricRating}>{metric.rating}</span>
                      {metric.trend && (
                        <span className={styles.metricTrend}>
                          <TrendingUp size={10} />
                          {metric.trend}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.ratingBar}>
                    <div 
                      className={styles.ratingFill}
                      style={{ 
                        width: `${metric.percentage}%`,
                        backgroundColor: getScoreColor(metric.percentage)
                      }}
                    ></div>
                  </div>
                  <span className={styles.metricPercentage}>{metric.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className={styles.reviewsSection}>
            <h3 className={styles.sectionSubtitle}>Recensioni Recenti</h3>
            <div className={styles.reviewsList}>
              {recentReviews.map((review, index) => (
                <div key={index} className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerInfo}>
                      <span className={styles.reviewerName}>{review.customer}</span>
                      <div className={styles.reviewRating}>
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <span className={styles.reviewTime}>{review.time}</span>
                  </div>
                  <div className={styles.reviewContent}>
                    <p className={styles.reviewComment}>"{review.comment}"</p>
                    <div className={styles.reviewProduct}>
                      <span>Prodotto: {review.product}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Items - Full Width */}
        <div className={styles.actionsSection}>
          <h3 className={styles.sectionSubtitle}>Azioni Suggerite</h3>
          <div className={styles.actionsList}>
            <div className={styles.actionItem}>
              <div className={styles.actionIcon}>
                <TrendingUp size={16} />
              </div>
              <div className={styles.actionContent}>
                <span className={styles.actionTitle}>Migliora Tempi di Spedizione</span>
                <span className={styles.actionDescription}>
                  Il 15% dei clienti vorrebbe spedizioni più veloci
                </span>
              </div>
              <button className={styles.actionBtn}>Applica</button>
            </div>
            
            <div className={styles.actionItem}>
              <div className={styles.actionIcon}>
                <MessageCircle size={16} />
              </div>
              <div className={styles.actionContent}>
                <span className={styles.actionTitle}>Richiedi Più Feedback</span>
                <span className={styles.actionDescription}>
                  Solo il 12% dei clienti lascia recensioni
                </span>
              </div>
              <button className={styles.actionBtn}>Configura</button>
            </div>

            <div className={styles.actionItem}>
              <div className={styles.actionIcon}>
                <Award size={16} />
              </div>
              <div className={styles.actionContent}>
                <span className={styles.actionTitle}>Programma Fedeltà</span>
                <span className={styles.actionDescription}>
                  Implementa un sistema di premi per clienti frequenti
                </span>
              </div>
              <button className={styles.actionBtn}>Pianifica</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatisfactionPanel;