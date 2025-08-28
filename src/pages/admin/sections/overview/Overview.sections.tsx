import React, { useState, useEffect } from "react";

import styles from "./OverviewSection.module.scss";
import DashboardHeader from "./Header/Header";
import QuickStatsBar from "./QuickStats/QuickStats";
import MainStatsGrid from "./MainStats/MainStats";
import PerformanceChart from "./Performance/Performance";
import CategoryChart from "./Charts/Charts";
import TrafficSources from "./Traffic/Traffic";
import ProductsOverview from "./Products/Products";
import ActivityFeed from "./Activity/Activity";
import TopProducts from "./TopProducts/TopProducts";
import DonationPanel from "./Donations/Donations";
import InsightsPanel from "./Insights/Insights";
import AlertsPanel from "./Alerts/Alerts";
import SatisfactionPanel from "./Satisfactions/Satisfactions";
import { useUi } from "@store_admin/ui/useUi";
interface AnalyticsOverviewProps {
  darkMode?: boolean;
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");

  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const { isDark } = useUi();
  const themeClass = isDark ? styles.darkMode : "";

  return (
    <div
      className={`${styles.analyticsDashboard} ${themeClass} ${
        isAnimated ? styles.animated : ""
      }`}
    >
      {/* Header */}
      <DashboardHeader
        setSelectedTimeRange={setSelectedTimeRange}
        selectedTimeRange={selectedTimeRange}
      />

      {/* Quick Stats */}
      <QuickStatsBar />

      {/* Main Stats */}
      <MainStatsGrid />

      <div className={styles.fullWidthSection}>
        <CategoryChart />
      </div>
      <div className={styles.fullWidthSection}>
        <PerformanceChart />
      </div>

      {/* Products Overview - FULL WIDTH */}
      <div className={styles.fullWidthSection}>
        <ProductsOverview />
      </div>

      {/* Traffic Analysis - FULL WIDTH */}
      <div className={styles.fullWidthSection}>
        <TrafficSources />
      </div>
      <div className={styles.fullWidthSection}>
        <DonationPanel />
      </div>
      <div className={styles.fullWidthSection}>
        <SatisfactionPanel />
      </div>
      {/* Main Dashboard Grid - Altri componenti */}
      <div className={styles.dashboardGrid}>
        <ActivityFeed />
        <TopProducts />
        <InsightsPanel />
        <AlertsPanel />
      </div>
    </div>
  );
};

export default AnalyticsOverview;
