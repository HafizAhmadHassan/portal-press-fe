import { type ReactNode } from "react";
import type { LucideIcon, TypeIcon } from "lucide-react";

export type FilterType = "email" | "name" | "select" | "text";

export interface BaseFilter {
  type: FilterType;
  key: string;
  label: string;
  name?: string;
  placeholder?: string;
  value: any;
  required?: boolean;
  disabled?: boolean;
}

export interface InputFilter extends BaseFilter {
  type: "email" | "name" | "text";
  typeIcon?: typeof TypeIcon | ReactNode;
  icon?: typeof TypeIcon | ReactNode;
  iconPosition?: "left" | "right";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFilter extends BaseFilter {
  type: "select";
  options: SelectOption[];
  onChange: (value: string | null) => void;
  // Rese opzionali le proprietà icon
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

export type FilterConfig = InputFilter | SelectFilter;
