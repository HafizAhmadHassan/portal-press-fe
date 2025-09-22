// components/LoginHeader/LoginHeader.tsx
import React from "react";
import styles from "./LoginHeader.module.scss";

const LoginHeader: React.FC = () => {
  return (
    <div className={styles.loginHeader}>
      <div className={styles.brand}>
        <div className={styles.brandIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L3.09 8.26L4 9L12 4L20 9L20.91 8.26L12 2Z"
              fill="url(#gradient1)"
            />
            <path d="M4 9V15L12 20L20 15V9L12 14L4 9Z" fill="url(#gradient2)" />
            <defs>
              <linearGradient
                id="gradient1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
              <linearGradient
                id="gradient2"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#4facfe" />
                <stop offset="100%" stopColor="#00f2fe" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className={styles.brandText}>
          <h1>Portale Press</h1>
          <span>Admin Panel</span>
        </div>
      </div>
    </div>
  );
};

export default LoginHeader;
