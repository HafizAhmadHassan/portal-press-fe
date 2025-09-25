import React from "react";
import styles from "./SimpleButton.module.scss";
import type { LucideIcon } from "lucide-react";

type SimpleButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "filled" | "outline" | "ghost";
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "danger";
  size?: "sm" | "md" | "lg" | "bare";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  className?: string;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  style?: React.CSSProperties;
};

export const SimpleButton: React.FC<SimpleButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "filled",
  color = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  className = "",
  href,
  target = "_self",
  style,
}) => {
  const IconComponent = icon;

  const buttonClass = [
    styles.simpleButton,
    styles[`simpleButton--${variant}`],
    styles[`simpleButton--${color}`],
    styles[`simpleButton--${size}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {iconPosition === "left" && IconComponent && (
        <IconComponent size={16} className={styles.simpleButton__icon} />
      )}

      <span className={styles.simpleButton__text}>{children}</span>

      {iconPosition === "right" && IconComponent && (
        <IconComponent size={16} className={styles.simpleButton__icon} />
      )}
    </>
  );

  return href ? (
    <a
      style={style}
      href={href}
      className={buttonClass}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
    >
      {content}
    </a>
  ) : (
    <button
      style={style}
      className={buttonClass}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {content}
    </button>
  );
};
