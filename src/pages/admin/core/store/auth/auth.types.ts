// store/auth/types.ts
export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refresh: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: number | null;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
