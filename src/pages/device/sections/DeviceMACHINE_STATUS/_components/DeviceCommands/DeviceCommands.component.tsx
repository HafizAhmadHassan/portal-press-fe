import React, { useState } from "react";
import { Loader2, Power, RefreshCw, AlertTriangle } from "lucide-react";
import styles from "./DeviceCommands.module.scss";

export type CommandItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
};

export interface DeviceCommandsProps {
  commands: CommandItem[];
  /** controllato: chiave comando in esecuzione */
  runningCommandKey?: string | null;
  /** controllato: handler esecuzione comando */
  onCommand?: (key: string) => Promise<void> | void;
}

export default function DeviceCommands({
  commands,
  runningCommandKey,
  onCommand,
}: DeviceCommandsProps) {
  // fallback non controllato se il padre non passa i prop
  const [localRunning, setLocalRunning] = useState<string | null>(null);
  const currentRunning = runningCommandKey ?? localRunning;

  const handleCommand = async (key: string) => {
    if (onCommand) {
      return onCommand(key);
    }
    // fallback demo
    setLocalRunning(key);
    try {
      await new Promise((r) => setTimeout(r, 750));
    } finally {
      setLocalRunning(null);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <RefreshCw size={16} />
          <span>Comandi</span>
        </div>
        <div className={styles.cardInfo}>
          <AlertTriangle size={14} />
          <span>Attenzione: l’esecuzione è immediata.</span>
        </div>
      </div>

      <div className={styles.cmdGrid}>
        {commands.map((cmd) => {
          const isRunning = currentRunning === cmd.key;
          return (
            <button
              key={cmd.key}
              type="button"
              className={[
                styles.cmdItem,
                cmd.danger ? styles.isDanger : "",
              ].join(" ")}
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
        })}
      </div>
    </div>
  );
}
