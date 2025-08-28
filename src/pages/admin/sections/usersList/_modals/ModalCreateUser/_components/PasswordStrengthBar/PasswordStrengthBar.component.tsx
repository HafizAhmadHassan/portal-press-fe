import { getStrength } from "@root/utils/strengthPsw";
import styles from "./PasswordStrengthBar.module.scss";

export default function PasswordStrengthBar({
  password,
}: {
  password: string;
}) {
  const strength = getStrength(password);
  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>Sicurezza password:</div>
      <div className={styles.bar}>
        <div
          className={`${styles.fill} ${styles[`s${strength}`]}`}
          style={{ width: `${(strength / 5) * 100}%` }}
        />
      </div>
      <div className={styles.text}>
        {strength <= 2 && "Debole"}
        {strength === 3 && "Media"}
        {strength === 4 && "Forte"}
        {strength === 5 && "Molto forte"}
      </div>
    </div>
  );
}
