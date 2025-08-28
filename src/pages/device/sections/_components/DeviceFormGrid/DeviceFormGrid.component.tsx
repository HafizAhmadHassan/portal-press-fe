import styles from "./DeviceFormGrid.module.scss";
export const DeviceFormGrid = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.formGrid}>{children}</div>;
};
