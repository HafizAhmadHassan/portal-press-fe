import React, { useState } from "react";
import styles from "./DeviceCommands.module.scss";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { DeviceCommandsBtn } from "./_components/DeviceCommandsBtn/DeviceCommandsBtn.component";

export type CommandItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
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
            <DeviceCommandsBtn
              key={cmd.key}
              cmd={cmd}
              isRunning={isRunning}
              handleCommand={handleCommand}
            />
          );
        })}
      </div>
    </div>
  );
}
