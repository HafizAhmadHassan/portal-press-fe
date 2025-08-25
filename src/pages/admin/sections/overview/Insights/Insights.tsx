import React from 'react';
import { Zap, TrendingUp, Award, Target, ChevronRight, Lightbulb, BarChart } from 'lucide-react';
import styles from './Insights.module.scss';

interface Insight {
  id: number;
  title: string;
  description: string;
  type: 'trend' | 'achievement' | 'goal';
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

interface InsightsPanelProps {
  insights?: Insight[];
  maxItems?: number;
  autoGenerate?: boolean;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({
  insights,
  maxItems = 5,
  autoGenerate = true
}) => {
  const defaultInsights: Insight[] = [
    {
      id: 1,
      title: "Trend Positivo Cibo Cani",
      description: "Le vendite di cibo per cani sono cresciute del 23% questa settimana rispetto alla media mensile",
      type: "trend",
      icon: <TrendingUp size={16} />,
      priority: "high",
      actionable: true
    },
    {
      id: 2,
      title: "Record Recensioni Positive",
      description: "Hai raggiunto il 94.5% di recensioni positive questo mese, il miglior risultato dell'anno",
      type: "achievement",
      icon: <Award size={16} />,
      priority: "medium",
      actionable: false
    },
    {
      id: 3,
      title: "Obiettivo Donazioni Superato",
      description: "Hai superato l'obiettivo mensile di donazioni del 15%, aiutando 12 rifugi in più del previsto",
      type: "goal",
      icon: <Target size={16} />,
      priority: "high",
      actionable: true
    },
    {
      id: 4,
      title: "Stagionalità Giocattoli",
      description: "I giocattoli per gatti mostrano un picco di vendite. Considera di aumentare il stock",
      type: "trend",
      icon: <BarChart size={16} />,
      priority: "medium",
      actionable: true
    },
    {
      id: 5,
      title: "Cliente Fedele Identificato",
      description: "Marco R. ha effettuato il 15° ordine. Potresti offrirgli uno sconto fedeltà",
      type: "achievement",
      icon: <Award size={16} />,
      priority: "low",
      actionable: true
    }
  ];

  const displayInsights = (insights || defaultInsights).slice(0, maxItems);

  const getInsightTypeLabel = (type: Insight['type']) => {
    switch (type) {
      case 'trend':
        return 'Tendenza';
      case 'achievement':
        return 'Risultato';
      case 'goal':
        return 'Obiettivo';
      default:
        return 'Insight';
    }
  };

  const getPriorityColor = (priority: Insight['priority']) => {
    switch (priority) {
      case 'high':
        return 'var(--error-color)';
      case 'medium':
        return 'var(--warning-color)';
      case 'low':
        return 'var(--success-color)';
      default:
        return 'var(--gray-400)';
    }
  };

  const getTypeColor = (type: Insight['type']) => {
    switch (type) {
      case 'trend':
        return 'var(--primary-color)';
      case 'achievement':
        return 'var(--success-color)';
      case 'goal':
        return 'var(--purple-color)';
      default:
        return 'var(--gray-400)';
    }
  };

  return (
    <div className={styles.insightsPanel}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <Zap size={20} />
          <h2>Insights Automatici</h2>
          {autoGenerate && (
            <div className={styles.autoGenBadge}>
              <Lightbulb size={12} />
              <span>Auto</span>
            </div>
          )}
        </div>
        <button className={styles.sectionAction}>
          Visualizza tutti
          <ChevronRight size={16} />
        </button>
      </div>

      <div className={styles.insightsList}>
        {displayInsights.map((insight) => (
          <div 
            key={insight.id} 
            className={`${styles.insightItem} ${styles[`insight${insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}`]}`}
          >
            <div className={styles.insightHeader}>
              <div className={styles.insightIcon} style={{ color: getTypeColor(insight.type) }}>
                {insight.icon}
              </div>
              <div className={styles.insightMeta}>
                <div className={styles.insightBadges}>
                  <span 
                    className={styles.priorityBadge}
                    style={{ backgroundColor: `${getPriorityColor(insight.priority)}20`, color: getPriorityColor(insight.priority) }}
                  >
                    {insight.priority}
                  </span>
                  <span 
                    className={styles.typeBadge}
                    style={{ backgroundColor: `${getTypeColor(insight.type)}20`, color: getTypeColor(insight.type) }}
                  >
                    {getInsightTypeLabel(insight.type)}
                  </span>
                </div>
                {insight.actionable && (
                  <div className={styles.actionableBadge}>
                    Azione suggerita
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.insightContent}>
              <div className={styles.insightTitle}>{insight.title}</div>
              <div className={styles.insightDescription}>{insight.description}</div>
            </div>

            {insight.actionable && (
              <div className={styles.insightActions}>
                <button className={styles.actionBtn}>
                  Applica Suggerimento
                </button>
                <button className={styles.dismissBtn}>
                  Ignora
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.insightsFooter}>
        <div className={styles.footerStats}>
          <div className={styles.footerStat}>
            <span className={styles.statValue}>{displayInsights.filter(i => i.actionable).length}</span>
            <span className={styles.statLabel}>Azioni disponibili</span>
          </div>
          <div className={styles.footerStat}>
            <span className={styles.statValue}>{displayInsights.filter(i => i.priority === 'high').length}</span>
            <span className={styles.statLabel}>Alta priorità</span>
          </div>
        </div>
        
        <div className={styles.footerActions}>
          <button className={styles.generateBtn}>
            <Zap size={14} />
            Genera nuovi insights
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;