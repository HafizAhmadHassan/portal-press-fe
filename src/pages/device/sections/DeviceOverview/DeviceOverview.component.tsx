import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Loader2,
  Power,
  RefreshCw,
  Wifi,
} from "lucide-react";
import styles from "./DeviceOverview.module.scss";

/** Stati supportati */
type DeviceStatus = "online" | "offline" | "unknown";

/** Tipi dei comandi/stato (interni al file) */
type CommandItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
};

type StatusItem =
  | { key: string; label: string; type: "boolean"; value: boolean }
  | { key: string; label: string; type: "number"; value: number; unit?: string }
  | { key: string; label: string; type: "text"; value: string };

export default function DeviceOverview() {
  // prende l'id dal path /device/:deviceId
  const { deviceId } = useParams<{ deviceId: string }>();

  // Dati placeholder per mostrare la UI finché non colleghi i dati reali alla view
  const deviceName = useMemo(
    () => (deviceId ? `Dispositivo #${deviceId}` : "Dispositivo"),
    [deviceId]
  );
  const deviceStatus: DeviceStatus = "online";
  const imageUrl = undefined as string | undefined;

  const commands: CommandItem[] = useMemo(
    () => [
      { key: "open-door", label: "Apri Serranda" },
      { key: "close-door", label: "Chiudi Serranda" },
      { key: "tare", label: "Tara" },
      { key: "maintenance", label: "Manutenzione", danger: true },
      { key: "restart", label: "Riavvia PLC", danger: true },
    ],
    []
  );

  const statusList: StatusItem[] = useMemo(
    () => [
      {
        key: "basket-in",
        label: "Cesto in Carico",
        type: "boolean",
        value: true,
      },
      {
        key: "basket-out",
        label: "Cesto in Scarico",
        type: "boolean",
        value: false,
      },
      {
        key: "pressure",
        label: "Pressione",
        type: "number",
        value: 0,
        unit: "bar",
      },
      {
        key: "weight",
        label: "Peso",
        type: "number",
        value: -0.149,
        unit: "kg",
      },
      { key: "seq", label: "Sequenza", type: "number", value: 70 },
      {
        key: "doors",
        label: "Porte Laterali Aperte",
        type: "boolean",
        value: false,
      },
      { key: "note", label: "Note", type: "text", value: "Ultimo reset 2h fa" },
    ],
    []
  );

  const [runningCommandKey, setRunningCommandKey] = useState<string | null>(
    null
  );

  const onCommand = async (key: string) => {
    setRunningCommandKey(key);
    try {
      await new Promise((r) => setTimeout(r, 750));
    } catch (e) {
      console.error(e);
    } finally {
      setRunningCommandKey(null);
    }
  };

  const statusBadge = {
    online: {
      label: "Online",
      className: styles.badgeOnline,
      icon: <Wifi size={14} />,
    },
    offline: {
      label: "Offline",
      className: styles.badgeOffline,
      icon: <Power size={14} />,
    },
    unknown: {
      label: "Sconosciuto",
      className: styles.badgeUnknown,
      icon: <AlertTriangle size={14} />,
    },
  }[deviceStatus];

  // Se manca l'id in URL, mostra messaggio minimale
  if (!deviceId) {
    return (
      <section className={styles.wrapper}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <AlertTriangle size={16} />
              <span>Nessun device selezionato</span>
            </div>
          </div>
          <div style={{ padding: "1rem" }}>
            Apri un device dalla lista per vedere l’overview.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.wrapper}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <h1 className={styles.title}>{deviceName}</h1>
          <span className={[styles.badge, statusBadge.className].join(" ")}>
            {statusBadge.icon}
            <span>{statusBadge.label}</span>
          </span>
        </div>

        {imageUrl ? (
          <div className={styles.heroImg}>
            <img
              src={imageUrl}
              alt={deviceName}
              onError={(e) =>
                ((e.target as HTMLImageElement).style.display = "none")
              }
            />
          </div>
        ) : null}
      </div>

      {/* COMMANDS */}
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
            const isRunning = runningCommandKey === cmd.key;
            return (
              <button
                key={cmd.key}
                type="button"
                className={[
                  styles.cmdItem,
                  cmd.danger ? styles.isDanger : "",
                ].join(" ")}
                onClick={() => onCommand(cmd.key)}
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

      {/* STATUS */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <Gauge size={16} />
            <span>Stato</span>
          </div>
        </div>

        <div className={styles.statGrid}>
          {statusList.map((s) => (
            <div key={s.key} className={styles.statItem}>
              <div className={styles.statLabel}>{s.label}</div>

              {s.type === "boolean" ? (
                <div
                  className={[
                    styles.badge,
                    s.value ? styles.badgeTrue : styles.badgeFalse,
                  ].join(" ")}
                >
                  <CheckCircle2 size={12} />
                  <span>{s.value ? "True" : "False"}</span>
                </div>
              ) : s.type === "number" ? (
                <div className={[styles.badge, styles.badgeNumber].join(" ")}>
                  <span>
                    {formatNumber(s.value)}
                    {s.unit ? ` ${s.unit}` : ""}
                  </span>
                </div>
              ) : (
                <div className={[styles.badge, styles.badgeInfo].join(" ")}>
                  <span>{s.value}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Util per numeri */
function formatNumber(n: number) {
  try {
    return new Intl.NumberFormat("it-IT", { maximumFractionDigits: 3 }).format(
      n
    );
  } catch {
    return String(n);
  }
}
