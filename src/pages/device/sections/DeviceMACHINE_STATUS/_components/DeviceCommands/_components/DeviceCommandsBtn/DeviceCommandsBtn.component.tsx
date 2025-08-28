import { Loader2, Power } from "lucide-react";
import type { CommandItem } from "../../DeviceCommands.component";
import styles from "./DeviceCommandsBtn.module.scss";

export const DeviceCommandsBtn = ({
  cmd,
  isRunning,
  handleCommand,
}: {
  cmd: CommandItem;
  isRunning: boolean;
  handleCommand: (key: string) => void;
}) => {
  return (
    <button
      key={cmd.key}
      type="button"
      className={[styles.cmdItem, cmd.danger ? styles.isDanger : ""].join(" ")}
      onClick={() => handleCommand(cmd.key)}
      disabled={cmd.disabled || isRunning}
      title={cmd.label}
    >
      <div className={styles.cmdIcon}>
        {isRunning ? (
          <Loader2 className={styles.spin} size={16} />
        ) : (
          cmd.icon ?? <Power size={16} />
        )}
      </div>
      <div className={styles.cmdLabel}>{cmd.label}</div>
      <div className={styles.cmdActionChip}>
        {isRunning ? "Esecuzione…" : "Press"}
      </div>
    </button>
  );
};
