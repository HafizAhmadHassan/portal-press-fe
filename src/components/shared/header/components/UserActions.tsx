import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "../styles/Actions.module.scss";
import { Moon, Sun } from "lucide-react";
import { useUi } from "@store_admin/ui/useUi";
import {
  DropDownNotification,
  type EmailLog,
} from "@components/shared/dropdown-notification/DropDownNotification.component";

import { useGetLogsQuery } from "@store_admin/logs/hooks/useLogsApi";

// 👇 prendo il cliente scelto in header
import { useAppSelector } from "@root/pages/admin/core/store/store.hooks";
import { selectScopedCustomer } from "@store_admin/scope/scope.selectors";

type Props = {
  MailIcon: React.ReactNode;
  GridIcon?: React.ReactNode;
  logs?: EmailLog[];
  loadingLogs?: boolean;
  onMarkAllRead?: () => void;
  onOpenInbox?: () => void;
  onClickLog?: (log: EmailLog) => void;
};

const READ_IDS_KEY = "ui.readLogsIds";

function loadReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_IDS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as Array<string | number>;
    return new Set(arr.map(String));
  } catch {
    return new Set();
  }
}
function saveReadIds(set: Set<string>) {
  try {
    localStorage.setItem(READ_IDS_KEY, JSON.stringify(Array.from(set)));
  } catch {
    /*  */
  }
}
function computeSeverity(
  name_alarm?: string,
  code_alarm?: string
): "info" | "warning" | "error" {
  const name = (name_alarm || "").toLowerCase();
  if (code_alarm?.startsWith("F")) return "error";
  if (
    name.includes("errore") ||
    name.includes("mancanza") ||
    name.includes("allarme") ||
    name.includes("bloccante")
  )
    return "error";
  if (name.includes("porta") || name.includes("superati")) return "warning";
  return "info";
}

export default function UserActions({
  MailIcon,
  logs: logsOverride,
  onMarkAllRead,
  onOpenInbox,
  onClickLog,
}: Props) {
  const { isDark, toggleTheme } = useUi();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // 🔗 cliente scelto in header
  const scopedCustomer = useAppSelector(selectScopedCustomer);

  // 🔎 ricerca server-side
  const [query, setQuery] = useState("");

  // ✅ query logs (customer_Name iniettato da baseQuery)
  const {
    data: logsResponse,
    refetch, // 👈 lo useremo sul cambio cliente
  } = useGetLogsQuery(
    {
      page: 1,
      page_size: 20,
      sortBy: "date_and_time",
      sortOrder: "desc",
      search: query || undefined,
    },
    { refetchOnMountOrArgChange: true }
  );

  // 🔁 quando cambia il cliente: reset ricerca e refetch
  useEffect(() => {
    setQuery("");
    refetch();
  }, [scopedCustomer, refetch]);

  // letti/non letti
  const [readIds, setReadIds] = useState<Set<string>>(() => loadReadIds());
  useEffect(() => saveReadIds(readIds), [readIds]);

  const logsFromApi = useMemo(() => {
    const raw = logsResponse?.data ?? [];
    return raw.map((item) => {
      const id = Number(item?.id);
      const unread = !readIds.has(String(id));
      return {
        id,
        subject: `${item?.name_alarm} (${item?.code_alarm})`,
        preview: `${item?.machine_ip} • ${item?.customer_Name}`,
        timestamp: item?.date_and_time,
        unread,
        severity: computeSeverity(item?.name_alarm, item?.code_alarm),
      };
    });
  }, [logsResponse?.data, readIds]);

  const dataset = useMemo(
    () => (logsOverride && logsOverride.length ? logsOverride : logsFromApi),
    [logsOverride, logsFromApi]
  );

  const unreadCount = useMemo(
    () => dataset.reduce((acc, l) => acc + (l.unread ? 1 : 0), 0),
    [dataset]
  );
  const badgeText = unreadCount > 99 ? "99+" : String(unreadCount);

  const handleMarkAllRead = () => {
    if (dataset.length === 0) return;
    const next = new Set(readIds);
    dataset.forEach((l) => next.add(String(l.id)));
    setReadIds(next);
    onMarkAllRead?.();
  };

  const handleClickLog = (log: EmailLog) => {
    const next = new Set(readIds);
    next.add(String(log.id));
    setReadIds(next);
    onClickLog?.(log);
  };

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

      <DropDownNotification
        anchorEl={btnRef.current}
        open={open}
        onClose={() => setOpen(false)}
        logs={dataset}
        // loading={loadingLogs || isFetchingLogs}
        onMarkAllRead={handleMarkAllRead}
        onOpenInbox={onOpenInbox}
        onClickItem={handleClickLog}
        title="Log di sistema"
        placement="bottom"
        align="end"
        width={460}
        // search server-side
        searchValue={query}
        onSearchValueChange={setQuery}
        onSubmitSearch={setQuery}
        disableLocalFilter
      />
    </div>
  );
}
