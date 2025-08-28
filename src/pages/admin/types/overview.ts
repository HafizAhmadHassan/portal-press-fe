// Base interfaces for analytics data
export interface QuickStat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}

export interface MainStat {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  subtitle: string;
  period: string;
  status: string;
  color: "green" | "blue" | "purple" | "orange";
  icon: React.ReactNode;
  trend: number[];
}

export interface Activity {
  id: number;
  customer: string;
  action: string;
  time: string;
  type: "success" | "donation" | "review" | "warning" | "info";
  details: string;
  location: string;
}

export interface Product {
  name: string;
  category: string;
  sales: number;
  revenue: string;
  rating: number;
}

export interface CategoryData {
  name: string;
  sales: number;
  stock: number;
  growth: string;
}

export interface CategoryStats {
  totalCategories: number;
  topSelling: number;
  lowStock: number;
  newArrivals: number;
  byCategory: CategoryData[];
}

export interface ProductCategory {
  type: string;
  percentage: number;
  color: string;
  revenue: string;
}

export interface PerformanceData {
  month: string;
  vendite: number;
  donazioni: number;
  ordini: number;
}

export interface TrafficSource {
  source: string;
  percentage: number;
  visitors: string;
  color: string;
}

export interface DeviceStats {
  device: string;
  percentage: number;
  icon: React.ReactNode;
}

export interface CustomerMetric {
  metric: string;
  value: string;
  change: string;
  positive: boolean;
}

export interface DonationStats {
  totalDonated: string;
  animalsHelped: number;
  sheltersSupported: number;
  avgDonation: string;
}

export interface Alert {
  id: number;
  type: "critical" | "warning" | "info";
  message: string;
  time: string;
}

export interface Insight {
  id: number;
  title: string;
  description: string;
  type: "trend" | "achievement" | "goal";
  icon: React.ReactNode;
}

export interface SatisfactionMetric {
  label: string;
  rating: number;
  percentage: number;
}

export interface SystemMetric {
  label: string;
  value: string;
  icon: React.ReactNode;
  status: "good" | "warning" | "error";
}

export interface Goal {
  title: string;
  progress: number;
  target: number;
  unit: string;
}

export interface Update {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  type: "feature" | "improvement" | "bugfix";
}

// Extended interfaces for more complex data
export interface SalesData {
  daily: number[];
  weekly: number[];
  monthly: number[];
  yearly: number[];
  labels: string[];
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  price: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
  lastUpdated: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  lastOrderDate: string;
  location: string;
  status: "active" | "inactive" | "new";
  satisfactionScore: number;
}

export interface Order {
  id: number;
  customerid: number;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  shippingAddress: Address;
  paymentMethod: string;
}

export interface OrderItem {
  productid: number;
  productName: string;
  quantity: number;
  price: number;
  category: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Donation {
  id: number;
  donorName: string;
  amount: number;
  shelter: string;
  animalType: "dog" | "cat" | "bird" | "other";
  message?: string;
  createdAt: string;
  status: "completed" | "pending" | "failed";
}

export interface Shelter {
  id: number;
  name: string;
  location: string;
  animalsHelped: number;
  totalDonationsReceived: number;
  contact: {
    email: string;
    phone: string;
  };
  verified: boolean;
}

// Component Props interfaces
export interface DashboardHeaderProps {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  selectedTimeRange: string;
  setSelectedTimeRange: (range: string) => void;
}

export interface QuickStatsBarProps {
  stats?: QuickStat[];
  loading?: boolean;
}

export interface MainStatsGridProps {
  stats?: MainStat[];
  loading?: boolean;
}

export interface ActivityFeedProps {
  activities?: Activity[];
  maxItems?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface ProductsOverviewProps {
  categoryStats?: CategoryStats;
  loading?: boolean;
}

export interface TopProductsProps {
  products?: Product[];
  maxItems?: number;
  sortBy?: "sales" | "revenue" | "rating";
}

export interface DonationPanelProps {
  donationStats?: DonationStats;
  recentDonations?: Donation[];
  loading?: boolean;
}

export interface AlertsPanelProps {
  alerts?: Alert[];
  maxItems?: number;
  onDismiss?: (alertId: number) => void;
}

export interface MiniChartProps {
  data: number[];
  color: string;
  width?: number;
  height?: number;
  showTooltip?: boolean;
  animated?: boolean;
}

export interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showText?: boolean;
  animated?: boolean;
  duration?: number;
}

export interface PerformanceChartProps {
  data?: PerformanceData[];
  showLegend?: boolean;
  height?: number;
  loading?: boolean;
}

export interface CategoryChartProps {
  categories?: ProductCategory[];
  showLabels?: boolean;
  size?: number;
  loading?: boolean;
}

export interface TrafficSourcesProps {
  sources?: TrafficSource[];
  deviceStats?: DeviceStats[];
  loading?: boolean;
}

export interface InsightsPanelProps {
  insights?: Insight[];
  maxItems?: number;
  autoGenerate?: boolean;
}

export interface SatisfactionPanelProps {
  overallScore?: number;
  metrics?: SatisfactionMetric[];
  loading?: boolean;
}

export interface AnalyticsOverviewProps {
  darkMode?: boolean;
  data?: AnalyticsData;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

// Data aggregation interfaces
export interface AnalyticsData {
  quickStats: QuickStat[];
  mainStats: MainStat[];
  activities: Activity[];
  products: Product[];
  categoryStats: CategoryStats;
  productCategories: ProductCategory[];
  performanceData: PerformanceData[];
  trafficSources: TrafficSource[];
  deviceStats: DeviceStats[];
  customerMetrics: CustomerMetric[];
  donationStats: DonationStats;
  alerts: Alert[];
  insights: Insight[];
  satisfactionMetrics: SatisfactionMetric[];
  systemMetrics: SystemMetric[];
  goals: Goal[];
  recentUpdates: Update[];
  lastUpdated: string;
}

export interface AnalyticsDataRequest {
  timeRange: FilterOptions["timeRange"];
  filters?: Partial<FilterOptions>;
  includeComparisons?: boolean;
  includePredictions?: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// Filter and search types
export interface FilterOptions {
  timeRange: "24h" | "7d" | "30d" | "90d" | "1y";
  category?: string;
  location?: string;
  status?: string;
  minValue?: number;
  maxValue?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SearchOptions {
  query: string;
  filters?: FilterOptions;
  limit?: number;
  offset?: number;
}

// Theme and UI types
export type ThemeMode = "light" | "dark" | "auto";

export interface ThemeContextType {
  isDark: boolean;
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

export interface LayoutSettings {
  sidebarCollapsed: boolean;
  gridColumns: number;
  compactMode: boolean;
  showAnimations: boolean;
}

// Notification types
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

// Export and reporting types
export interface ExportOptions {
  format: "pdf" | "excel" | "csv" | "json";
  dateRange: {
    start: string;
    end: string;
  };
  includeCharts: boolean;
  includeRawData: boolean;
  sections: string[];
}

export interface ReportConfig {
  title: string;
  description?: string;
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
  recipients: string[];
  template: string;
  filters: FilterOptions;
}

// Webhook and integration types
export interface WebhookEvent {
  id: number;
  type: string;
  data: any;
  timestamp: string;
  source: string;
}

export interface Integration {
  id: number;
  name: string;
  type: "webhook" | "api" | "database";
  status: "active" | "inactive" | "error";
  config: Record<string, any>;
  lastSync?: string;
}

// User and permissions
/* export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  permissions: string[];
  lastLogin: string;
  preferences: UserPreferences;
} */

export interface UserPreferences {
  theme: ThemeMode;
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  dashboard: {
    layout: LayoutSettings;
    widgets: string[];
  };
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncData<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// Form validation types
export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "email"
    | "password"
    | "select"
    | "checkbox"
    | "date";
  value: any;
  validation?: ValidationRule;
  options?: { label: string; value: any }[];
}

export interface FormState {
  fields: Record<string, FormField>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
}
