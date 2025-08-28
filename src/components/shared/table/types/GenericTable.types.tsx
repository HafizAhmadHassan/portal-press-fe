import { type ReactNode } from "react";

export type ColumnType =
  | "text"
  | "email"
  | "avatar"
  | "badge"
  | "select"
  | "boolean"
  | "actions"
  | "custom";

export interface BadgeConfig {
  [key: string]: {
    label: string;
    className: string;
  };
}

export interface SelectConfig {
  options: Array<{
    value: string;
    label: string;
  }>;
  onChange?: (item: any, newValue: string) => void;
}

export interface ActionConfig {
  label: string;
  onClick: (item: any) => void;
  className?: string;
  disabled?: (item: any) => boolean;
  icon?: ReactNode;
}

export interface AvatarConfig {
  nameField?: string;
  emailField?: string;
  avatarField?: string;
  size?: "sm" | "md" | "lg";
}

export interface BooleanConfig {
  trueLabel?: string;
  falseLabel?: string;
  trueClassName?: string;
  falseClassName?: string;
}

export interface TableColumn<T = any> {
  key: string;
  header: string;
  type: ColumnType;
  width?: string;
  sortable?: boolean;
  badgeConfig?: BadgeConfig;
  selectConfig?: SelectConfig;
  avatarConfig?: AvatarConfig;
  booleanConfig?: BooleanConfig;
  actions?: ActionConfig[];
  render?: (value: any, item: T) => ReactNode;
  accessor?: (item: T) => any;
}

export interface TableConfig<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  pagination?: {
    enabled: boolean;
    pageSize?: number;
    totalItems?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
  };
  sorting?: {
    enabled: boolean;
    defaultSort?: {
      key: string;
      direction: "asc" | "desc";
    };
    onSort?: (key: string, direction: "asc" | "desc") => void;
  };
  selection?: {
    enabled: boolean;
    selectedItems?: any[];
    onSelectionChange?: (selectedItems: any[]) => void;
    idField?: string;
  };
}

export interface GenericTableProps<T = any> {
  config: TableConfig<T>;
  paginatedData: T[];
  currentPage: number;
  totalPages: number;
  selectedItems: any[];
  sortConfig?: {
    key: string;
    direction: "asc" | "desc";
  } | null;
  onSort: (key: string) => void;
  onPageChange: (page: number) => void;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (item: T, checked: boolean) => void;
}

export interface GenericTableWithLogicProps<T = any>
  extends Omit<
    GenericTableProps<T>,
    | "paginatedData"
    | "currentPage"
    | "totalPages"
    | "selectedItems"
    | "sortConfig"
    | "onSort"
    | "onPageChange"
    | "onSelectAll"
    | "onSelectItem"
  > {
  searchFields?: (keyof T)[];
  searchValue?: string;
  customFilters?: Array<{
    field: keyof T;
    value: any;
    operator?: "equals" | "includes" | "startsWith" | "custom";
    customFilter?: (item: T, value: any) => boolean;
  }>;
  onDataChange?: (filteredData: T[]) => void;
  onSelectionChange?: (selectedItems: T[]) => void;
}
