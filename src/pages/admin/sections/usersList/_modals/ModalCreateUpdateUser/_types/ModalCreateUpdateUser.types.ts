import type { User } from "@store_admin/users/user.types";

export type ModalMode = "create" | "edit";

export interface ModalCreateUpdateUserProps {
  mode: ModalMode;
  onSave?: (userData: Partial<User>) => Promise<void>;
  triggerButton?: React.ReactNode;
  initialUser?: Partial<User> | null;
}

export interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  isStaff: boolean;
  isSuperuser: boolean;
  permissions: string[];
}

export interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}
