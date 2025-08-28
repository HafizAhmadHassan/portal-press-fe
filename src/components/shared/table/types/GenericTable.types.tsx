import type { ReactNode } from "react";

// ---------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------
export type SortDirection = "asc" | "desc";

export type ColumnType =
  | "text"
  | "email"
  | "avatar"
  | "badge"
  | "select"
  | "boolean"
  | "actions"
  | "custom";

/** Value for key K; unknown if K isn't a key of T */
export type ValueOfKey<T, K> = K extends keyof T ? T[K] : unknown;

// ---------------------------------------------------------------
// Column configs (strongly typed, no any)
// ---------------------------------------------------------------
export type BadgeConfig = Record<string, { label: string; className: string }>; // keys: e.g. "true" | "false" | arbitrary status

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarConfig<T> {
  /** Campo del nome visualizzato (es. full_name, firstName, ecc.) */
  nameField?: keyof T;
  /** Campo dell'email (opzionale) */
  emailField?: keyof T;
  /** Campo dell'URL avatar (es. avatar_url) */
  avatarField?: keyof T;
  size?: AvatarSize;
}

export interface BooleanConfig {
  trueLabel?: string;
  falseLabel?: string;
  trueClassName?: string;
  falseClassName?: string;
}

export interface ActionConfig<T> {
  label: string;
  onClick: (item: T) => void;
  className?: string;
  disabled?: (item: T) => boolean;
  icon?: ReactNode;
}

export interface SelectOption<V extends string | number> {
  value: V;
  label: string;
}

export interface SelectConfig<T, V extends string | number = string> {
  options: Array<SelectOption<V>>;
  onChange?: (item: T, newValue: V) => void;
}

// Base colonna
export interface ColumnBase<T, K extends keyof T | string = keyof T | string> {
  key: K; // permette anche chiavi "virtuali" (string) per accessor custom
  header: string;
  type: ColumnType;
  width?: string;
  sortable?: boolean;
}

export interface TextColumn<T, K extends keyof T = keyof T>
  extends ColumnBase<T, K> {
  type: "text" | "email";
}

export interface AvatarColumn<T, K extends keyof T = keyof T>
  extends ColumnBase<T, K> {
  type: "avatar";
  avatarConfig?: AvatarConfig<T>;
}

export interface BadgeColumn<T, K extends keyof T = keyof T>
  extends ColumnBase<T, K> {
  type: "badge";
  badgeConfig: BadgeConfig;
  /** Se non fornito, verrà usato T[K] come value */
  accessor?: (item: T) => string | number | boolean;
}

export interface SelectColumn<
  T,
  K extends keyof T = keyof T,
  V extends string | number = string
> extends ColumnBase<T, K> {
  type: "select";
  selectConfig: SelectConfig<T, V>;
  accessor?: (item: T) => V; // se assente, si tenta T[K] (deve essere compatibile con V)
}

export interface BooleanColumn<T, K extends keyof T = keyof T>
  extends ColumnBase<T, K> {
  type: "boolean";
  booleanConfig?: BooleanConfig;
  accessor?: (item: T) => boolean; // se assente, si interpreta Boolean(T[K])
}

export interface ActionsColumn<T> extends ColumnBase<T, string> {
  type: "actions";
  actions: Array<ActionConfig<T>>;
}

export interface CustomColumn<
  T,
  K extends keyof T | string = keyof T | string,
  V = ValueOfKey<T, K>
> extends ColumnBase<T, K> {
  type: "custom";
  render: (value: V, item: T) => ReactNode;
  accessor?: (item: T) => V; // se assente, value è T[K] (o unknown se K è string virtuale)
}

export type TableColumn<T, K extends keyof T | string = keyof T | string> =
  | TextColumn<T, Extract<K, keyof T>>
  | AvatarColumn<T, Extract<K, keyof T>>
  | BadgeColumn<T, Extract<K, keyof T>>
  | SelectColumn<T, Extract<K, keyof T>>
  | BooleanColumn<T, Extract<K, keyof T>>
  | ActionsColumn<T>
  | CustomColumn<T, K>;

// ---------------------------------------------------------------
// Table config & props
// ---------------------------------------------------------------
export type TablePagination = {
  enabled: boolean;
  pageSize?: number;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;

  // campi "ricchi" opzionali
  onPageSizeChange?: (size: number) => void;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
  nextPage?: number | null;
  prevPage?: number | null;
};

export type TableSorting<T, K extends keyof T | string = keyof T | string> = {
  enabled: boolean;
  defaultSort?: {
    key: K; // permette chiavi di T o chiavi virtuali
    direction: SortDirection;
  };
  onSort?: (key: K, direction: SortDirection) => void;
};

export type TableSelection<T> = {
  enabled: boolean;
  selectedItems?: PropertyKey[]; // id degli item (string | number | symbol)
  onSelectionChange?: (selectedItems: PropertyKey[]) => void;
  idField?: keyof T; // campo che funge da id
};

export interface TableConfig<T, K extends keyof T | string = keyof T | string> {
  columns: Array<TableColumn<T, K>>;
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;

  pagination?: TablePagination;
  sorting?: TableSorting<T, K>;
  selection?: TableSelection<T>;
}

export interface GenericTableProps<
  T,
  K extends keyof T | string = keyof T | string
> {
  config: TableConfig<T, K>;
  paginatedData: T[];
  currentPage: number;
  totalPages: number;
  selectedItems: PropertyKey[];
  sortConfig: {
    key: K;
    direction: SortDirection;
  } | null;
  onSort: (key: K) => void;
  onPageChange: (page: number) => void;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (item: T, checked: boolean) => void;
}

export type FilterOperator = "equals" | "includes" | "startsWith" | "custom";

export type CustomFilterFn<T, K extends keyof T> = (
  item: T,
  value: T[K]
) => boolean;

export type FilterDef<T, K extends keyof T = keyof T> = {
  field: K;
  value: T[K];
  operator?: FilterOperator;
  customFilter?: CustomFilterFn<T, K>;
};

export interface GenericTableWithLogicProps<
  T,
  K extends keyof T | string = keyof T | string
> extends Omit<
    GenericTableProps<T, K>,
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
  searchFields?: Array<Extract<keyof T, string>>; // solo campi stringa cercabili
  searchValue?: string;
  customFilters?: Array<FilterDef<T>>; // unione dei tipi dei campi di T
  onDataChange?: (filteredData: T[]) => void;
  onSelectionChange?: (selectedItems: T[]) => void; // opzionale: restituisce gli item completi
}
