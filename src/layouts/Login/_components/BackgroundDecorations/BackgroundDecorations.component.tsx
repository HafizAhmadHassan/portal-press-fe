// components/BackgroundDecorations/BackgroundDecorations.tsx
import React from "react";
import styles from "./BackgroundDecorations.module.scss";

const BackgroundDecorations: React.FC = () => {
  return (
    <div className={styles.backgroundDecorations}>
      <div className={`${styles.decorationCircle} ${styles.circle1}`}></div>
      <div className={`${styles.decorationCircle} ${styles.circle2}`}></div>
      <div className={`${styles.decorationCircle} ${styles.circle3}`}></div>
      <div className={`${styles.decorationBlob} ${styles.blob1}`}></div>
      <div className={`${styles.decorationBlob} ${styles.blob2}`}></div>
      <div className={styles.floatingShapes}>
        <div className={`${styles.shape} ${styles.shape1}`}></div>
        <div className={`${styles.shape} ${styles.shape2}`}></div>
        <div className={`${styles.shape} ${styles.shape3}`}></div>
        <div className={`${styles.shape} ${styles.shape4}`}></div>
        <div className={`${styles.shape} ${styles.shape5}`}></div>
        <div className={`${styles.shape} ${styles.shape6}`}></div>
      </div>
    </div>
  );
};

export default BackgroundDecorations;
