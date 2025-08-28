export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  isStaff: boolean;
  isSuperuser: boolean;
  lastLogin?: string | null;
  dateJoined: string;
  groups: string[];
  permissions: string[];
  avatar?: string;
  avatarUrl?: string;
  role: string;
}

export interface UsersState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    search: string;
    role: string;
    isActive: boolean | null;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role?: "admin" | "user" | "moderator";
  isActive?: boolean;
}

export interface UpdateUserRequest {
  id: number;
  data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>;
}

export interface UsersQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Nuova struttura di risposta dell'API con meta
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

// Risposta specifica per gli utenti
export interface UsersResponse extends ApiResponse<User> {
  meta: ApiMeta;
  data: User[];
}

export interface BulkActionRequest {
  userIds: string[];
  action: "activate" | "deactivate" | "delete" | "updateRole";
  data?: {
    role?: "admin" | "user" | "moderator";
    isActive?: boolean;
  };
}

export interface UsersStatsResponse {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  moderatorUsers: number;
  regularUsers: number;
}
