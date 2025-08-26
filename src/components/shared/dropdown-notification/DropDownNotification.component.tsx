import React, { useMemo, useState } from "react";
import { CheckCheck, ExternalLink, MailOpen, Search } from "lucide-react";
import {
  Dropdown,
  type DropdownAlign,
  type DropdownPlacement,
} from "@components/shared/dropdown/DropDown.component";
import styles from "./DropDownNotification.module.scss";

export type LogSeverity = "info" | "warning" | "error";

export interface EmailLog {
  id: string | number;
  subject: string;
  timestamp: string | number | Date;
  preview?: string;
  unread?: boolean;
  severity?: LogSeverity;
}

type Props = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;

  logs: EmailLog[];
  loading?: boolean;

  onMarkAllRead?: () => void;
  onOpenInbox?: () => void;
  onClickItem?: (log: EmailLog) => void;

  title?: string;
  placement?: DropdownPlacement;
  align?: DropdownAlign;
  width?: number | string;

  /** Ricerca: controllata o interna */
  searchValue?: string;
  onSearchValueChange?: (v: string) => void;
  onSubmitSearch?: (v: string) => void;
  searchPlaceholder?: string;

  /** Se true, NON applica filtro locale (utile se fai search server-side) */
  disableLocalFilter?: boolean;
};

const formatTime = (ts: string | number | Date) => {
  try {
    const d = new Date(ts);
    const fmt = new Intl.DateTimeFormat(
      typeof navigator !== "undefined" ? navigator.language : "it-IT",
      { dateStyle: "medium", timeStyle: "short" }
    );
    return fmt.format(d);
  } catch {
    return String(ts);
  }
};

export function DropDownNotification({
  anchorEl,
  open,
  onClose,
  logs,
  loading,
  onMarkAllRead,
  onOpenInbox,
  onClickItem,
  title = "Email Logs",
  placement = "bottom",
  align = "end",
  width = 460,
  searchValue,
  onSearchValueChange,
  onSubmitSearch,
  searchPlaceholder = "Cerca nei log…",
  disableLocalFilter = false,
}: Props) {
  // Stato interno se non è controllato dall'esterno
  const [internalQuery, setInternalQuery] = useState("");
  const query = (searchValue ?? internalQuery).trim();

  const onChangeQuery = (v: string) => {
    if (onSearchValueChange) onSearchValueChange(v);
    else setInternalQuery(v);
  };

  const onSubmitQuery = () => {
    if (onSubmitSearch) onSubmitSearch(query);
    // altrimenti usa filtro locale (default)
  };

  const visibleLogs = useMemo(() => {
    if (!query || disableLocalFilter) return logs;
    const q = query.toLowerCase();
    return logs.filter((l) =>
      [l.subject, l.preview].some((s) => (s || "").toLowerCase().includes(q))
    );
  }, [logs, query, disableLocalFilter]);

  return (
    <Dropdown
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      placement={placement}
      align={align}
      width={width}
      showArrow
      header={
        <div className={styles.headerRow}>
          <div className={styles.title}>{title}</div>

          {/* SEARCH */}
          <div className={styles.searchWrap}>
            <div className={styles.searchPill}>
              <div style={{ position: "relative", flex: 1 }}>
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-secondary)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  aria-label="Cerca nei log"
                  placeholder={searchPlaceholder}
                  value={query}
                  onChange={(e) => onChangeQuery(e.target.value)}
                  onKeyUp={(e) => e.key === "Enter" && onSubmitQuery()}
                  style={{
                    width: "100%",
                    height: 36,
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    padding: "0 10px 0 34px",
                    color: "var(--text-primary)",
                    fontSize: ".9rem",
                  }}
                />
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className={styles.headerActions}>
            <button
              className={styles.iconBtn}
              onClick={onMarkAllRead}
              title="Segna tutti come letti"
              aria-label="Segna tutti come letti"
              type="button"
            >
              <CheckCheck size={16} />
            </button>
            <button
              className={styles.iconBtn}
              onClick={onOpenInbox}
              title="Apri Inbox"
              aria-label="Apri Inbox"
              type="button"
            >
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      }
      footer={
        <div className={styles.footerRow}>
          <span style={{ fontSize: ".8rem", color: "var(--text-secondary)" }}>
            {visibleLogs?.length ?? 0} elementi
          </span>
          <button
            className={styles.linkBtn}
            onClick={onOpenInbox}
            type="button"
          >
            Vedi tutto
          </button>
        </div>
      }
    >
      <div className={styles.container}>
        {loading ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>⌛</div>
            Caricamento…
          </div>
        ) : visibleLogs.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <MailOpen size={28} />
            </div>
            Nessun log trovato
          </div>
        ) : (
          <div className={styles.list} role="list">
            {visibleLogs.map((log) => (
              <div
                key={`${log.id}-${String(log.timestamp)}`}
                className={styles.item}
                role="listitem"
                onClick={() => onClickItem?.(log)}
              >
                <div
                  className={[
                    styles.severity,
                    log.severity === "warning"
                      ? "warning"
                      : log.severity === "error"
                      ? "error"
                      : "info",
                  ].join(" ")}
                />
                <div className={styles.main}>
                  <div className={styles.subjectRow}>
                    <div className={styles.subject} title={log.subject}>
                      {log.subject}
                    </div>
                    <div className={styles.badges}>
                      {log.unread ? (
                        <span className={styles.unreadDot} title="Non letto" />
                      ) : null}
                    </div>
                  </div>
                  {log.preview ? (
                    <div className={styles.preview}>{log.preview}</div>
                  ) : null}
                </div>
                <div className={styles.time} aria-label="timestamp">
                  {formatTime(log.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Dropdown>
  );
}
