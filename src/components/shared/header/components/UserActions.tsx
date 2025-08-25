import React, { useRef, useState } from "react";
import styles from "../styles/Actions.module.scss";
import { Moon, Sun } from "lucide-react";
import { useUi } from "@store_admin/ui/useUi";
import {
  DropDownNotification,
  type EmailLog,
} from "@components/shared/dropdown-notification/DropDownNotification.component";

type Props = {
  MailIcon: React.ReactNode;
  GridIcon?: React.ReactNode;

  /** Logs da mostrare nel dropdown */
  logs?: EmailLog[];
  loadingLogs?: boolean;
  onMarkAllRead?: () => void;
  onOpenInbox?: () => void;
  onClickLog?: (log: EmailLog) => void;
};

export default function UserActions({
  MailIcon,
  GridIcon,
  logs = [],
  loadingLogs,
  onMarkAllRead,
  onOpenInbox,
  onClickLog,
}: Props) {
  const { isDark, toggleTheme } = useUi();

  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // DEMO: rimuovi quando userai logs da prop
  const logsMock: EmailLog[] = [
    {
      id: 1,
      subject: "Generale - Errore di comunicazione con HMI : 10.20.2.13",
      preview:
        "geovision: timeout richiesta, controllare cablaggio e connessione",
      timestamp: Date.now() - 5 * 60 * 1000,
      unread: true,
      severity: "error",
    },
    {
      id: 2,
      subject: "Generale - Errore di comunicazione con HMI : 10.20.2.8",
      preview: "HMI non raggiungibile da 3 minuti",
      timestamp: Date.now() - 15 * 60 * 1000,
      unread: true,
      severity: "warning",
    },
    {
      id: 3,
      subject: "Ripristino comunicazione con HMI : 10.20.2.4",
      preview: "Connessione ristabilita",
      timestamp: Date.now() - 50 * 60 * 1000,
      unread: false,
      severity: "info",
    },
    {
      id: 1,
      subject: "Generale - Errore di comunicazione con HMI : 10.20.2.13",
      preview:
        "geovision: timeout richiesta, controllare cablaggio e connessione",
      timestamp: Date.now() - 5 * 60 * 1000,
      unread: true,
      severity: "error",
    },
    {
      id: 2,
      subject: "Generale - Errore di comunicazione con HMI : 10.20.2.8",
      preview: "HMI non raggiungibile da 3 minuti",
      timestamp: Date.now() - 15 * 60 * 1000,
      unread: true,
      severity: "warning",
    },
    {
      id: 3,
      subject: "Ripristino comunicazione con HMI : 10.20.2.4",
      preview: "Connessione ristabilita",
      timestamp: Date.now() - 50 * 60 * 1000,
      unread: false,
      severity: "info",
    },
    {
      id: 1,
      subject: "Generale - Errore di comunicazione con HMI : 10.20.2.13",
      preview:
        "geovision: timeout richiesta, controllare cablaggio e connessione",
      timestamp: Date.now() - 5 * 60 * 1000,
      unread: true,
      severity: "error",
    },
    {
      id: 2,
      subject: "Generale - Errore di comunicazione con HMI : 10.20.2.8",
      preview: "HMI non raggiungibile da 3 minuti",
      timestamp: Date.now() - 15 * 60 * 1000,
      unread: true,
      severity: "warning",
    },
    {
      id: 3,
      subject: "Ripristino comunicazione con HMI : 10.20.2.4",
      preview: "Connessione ristabilita",
      timestamp: Date.now() - 50 * 60 * 1000,
      unread: false,
      severity: "info",
    },
    {
      id: 1,
      subject: "Generale - Errore di comunicazione con HMI : 10.20.2.13",
      preview:
        "geovision: timeout richiesta, controllare cablaggio e connessione",
      timestamp: Date.now() - 5 * 60 * 1000,
      unread: true,
      severity: "error",
    },
    {
      id: 2,
      subject: "Generale - Errore di comunicazione con HMI : 10.20.2.8",
      preview: "HMI non raggiungibile da 3 minuti",
      timestamp: Date.now() - 15 * 60 * 1000,
      unread: true,
      severity: "warning",
    },
    {
      id: 3,
      subject: "Ripristino comunicazione con HMI : 10.20.2.4",
      preview: "Connessione ristabilita",
      timestamp: Date.now() - 50 * 60 * 1000,
      unread: false,
      severity: "info",
    },
    {
      id: 1,
      subject: "Generale - Errore di comunicazione con HMI : 10.20.2.13",
      preview:
        "geovision: timeout richiesta, controllare cablaggio e connessione",
      timestamp: Date.now() - 5 * 60 * 1000,
      unread: true,
      severity: "error",
    },
    {
      id: 2,
      subject: "Generale - Errore di comunicazione con HMI : 10.20.2.8",
      preview: "HMI non raggiungibile da 3 minuti",
      timestamp: Date.now() - 15 * 60 * 1000,
      unread: true,
      severity: "warning",
    },
    {
      id: 3,
      subject: "Ripristino comunicazione con HMI : 10.20.2.4",
      preview: "Connessione ristabilita",
      timestamp: Date.now() - 50 * 60 * 1000,
      unread: false,
      severity: "info",
    },
    {
      id: 1,
      subject: "Generale - Errore di comunicazione con HMI : 10.20.2.13",
      preview:
        "geovision: timeout richiesta, controllare cablaggio e connessione",
      timestamp: Date.now() - 5 * 60 * 1000,
      unread: true,
      severity: "error",
    },
    {
      id: 2,
      subject: "Generale - Errore di comunicazione con HMI : 10.20.2.8",
      preview: "HMI non raggiungibile da 3 minuti",
      timestamp: Date.now() - 15 * 60 * 1000,
      unread: true,
      severity: "warning",
    },
    {
      id: 3,
      subject: "Ripristino comunicazione con HMI : 10.20.2.4",
      preview: "Connessione ristabilita",
      timestamp: Date.now() - 50 * 60 * 1000,
      unread: false,
      severity: "info",
    },
    {
      id: 1,
      subject: "Generale - Errore di comunicazione con HMI : 10.20.2.13",
      preview:
        "geovision: timeout richiesta, controllare cablaggio e connessione",
      timestamp: Date.now() - 5 * 60 * 1000,
      unread: true,
      severity: "error",
    },
    {
      id: 2,
      subject: "Generale - Errore di comunicazione con HMI : 10.20.2.8",
      preview: "HMI non raggiungibile da 3 minuti",
      timestamp: Date.now() - 15 * 60 * 1000,
      unread: true,
      severity: "warning",
    },
    {
      id: 3,
      subject: "Ripristino comunicazione con HMI : 10.20.2.4",
      preview: "Connessione ristabilita",
      timestamp: Date.now() - 50 * 60 * 1000,
      unread: false,
      severity: "info",
    },
  ];

  // Usa i logs passati da prop se presenti, altrimenti i mock
  const dataset = logs.length ? logs : logsMock;
  const unreadCount = dataset.reduce((acc, l) => acc + (l.unread ? 1 : 0), 0);
  const badgeText = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <div className={styles.actions}>
      <button
        ref={btnRef}
        className={styles.actionBtn}
        aria-label="Notifiche"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        {MailIcon}

        {/* Badge notifiche */}
        {unreadCount > 0 && (
          <span
            className={styles.notificationBadge}
            aria-label={`${unreadCount} notifiche non lette`}
            title={`${unreadCount} notifiche non lette`}
          >
            {badgeText}
          </span>
        )}
      </button>

      <button className={styles.btnOutline} onClick={() => toggleTheme()}>
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* DROPDOWN NOTIFICHE */}
      <DropDownNotification
        anchorEl={btnRef.current}
        open={open}
        onClose={() => setOpen(false)}
        logs={dataset}
        loading={loadingLogs}
        onMarkAllRead={onMarkAllRead}
        onOpenInbox={onOpenInbox}
        onClickItem={(log) => onClickLog?.(log)}
        title="Email Logs"
        placement="bottom"
        align="end"
        width={460}
      />
    </div>
  );
}
