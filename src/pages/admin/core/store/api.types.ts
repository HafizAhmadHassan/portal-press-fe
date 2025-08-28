export interface ApiMeta {
  total: number;
  total_pages: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_prev: boolean;
  next_page: number | null;
  prev_page: number | null;
}

export interface ApiResponse<T> {
  meta: ApiMeta;
  data: T[];
}
