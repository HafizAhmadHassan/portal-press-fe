import {
  Outlet,
  useParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useMemo, useEffect } from "react";
import { ArrowLeft, RotateCw } from "lucide-react";
import LogoKgn from "@assets/images/kgn-logo.png";
import styles from "./Device-layout.module.scss";
import Header from "@shared/header/Header.component.tsx";
import SideNav from "@shared/side-navbar/SideNavbar.component.tsx";
import { deviceLayoutSideNavItems } from "@layouts/device/_utils/SideNavItems.tsx";
import { SimpleButton } from "@root/components/shared/simple-btn/SimpleButton.component";
import { useGetDeviceByIdQuery } from "@root/pages/admin/core/store/devices/devices.api";
import Switch from "@root/components/shared/switch/Switch.component";
import { useSession } from "@root/pages/admin/core/store/auth/hooks/useSession";
import { UserRoles } from "@root/utils/constants/userRoles";

export default function DeviceLayout() {
  const navigate = useNavigate();
  const { deviceId, id } = useParams<{ deviceId?: string; id?: string }>();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const pathId = useMemo(() => {
    const match = location.pathname.match(/\/device\/([^/]+)/);
    return match?.[1];
  }, [location.pathname]);

  const { user } = useSession();

  const currentDeviceId = deviceId ?? id ?? pathId;

  const menuItems = useMemo(
    () => deviceLayoutSideNavItems(currentDeviceId),
    [currentDeviceId]
  );

  const parsedId = deviceId ? Number(deviceId) : undefined;
  const { data: device, refetch } = useGetDeviceByIdQuery(parsedId!, {
    skip: !parsedId,
  });

  // === Single source of truth: ?edit=1
  const editMode = searchParams.get("edit") === "1";

  // Retro-compat: se l'URL termina con /edit e manca ?edit=1, aggiungilo.
  useEffect(() => {
    const endsWithEdit = location.pathname.endsWith("/edit");
    const hasParam = searchParams.get("edit") === "1";
    if (endsWithEdit && !hasParam) {
      const next = new URLSearchParams(searchParams);
      next.set("edit", "1");
      setSearchParams(next, { replace: true });
    }
    // NB: Non rimuoviamo /edit dalla path (no redirect) per non rompere rotte esistenti.
  }, [location.pathname, searchParams, setSearchParams]);

  const handleToggleEdit = (on: boolean) => {
    const next = new URLSearchParams(searchParams);
    if (on) next.set("edit", "1");
    else next.delete("edit");
    setSearchParams(next, { replace: true });
    // Le pagine figlie reagiscono a questo cambiamento leggendo ?edit=1
  };

  // =========================
  // VISIBILITÀ SWITCH "MODIFICA"
  // =========================
  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;

  // estrae la parte del path dopo /device/:id
  const isDetailPage = useMemo(() => {
    // prendi tutto ciò che viene dopo /device/<id>
    const afterId = location.pathname.replace(/^.*\/device\/[^/]+/, "");
    // pagina di dettaglio se è root, "/" oppure "/edit"
    return (
      afterId === "" ||
      afterId === "/" ||
      afterId === "/edit" ||
      afterId === "/edit/"
    );
  }, [location.pathname]);

  // regola:
  // - SUPER_ADMIN: mostra in pagina di dettaglio
  // - NON SUPER_ADMIN: non mostrare in pagina di dettaglio, ma mostrare nelle sotto-pagine
  const showEditSwitch = useMemo(() => {
    if (isSuperAdmin) return isDetailPage;
    return !isDetailPage; // non super → mostra solo nelle altre pagine
  }, [isSuperAdmin, isDetailPage]);

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.body}>
        <SideNav
          menuItems={menuItems}
          brand={{ logo: LogoKgn, title: "KGN srl", subtitle: "Admin Panel" }}
          showCollapseButton
          showMobileToggle
        />

        <main className={styles.content}>
          <div className={styles.pageHeader}>
            <button
              className={styles.backBtn}
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft size={18} />
              <span>Torna alla Dashboard</span>
            </button>

            <div className={styles.pageActions}>
              <SimpleButton
                size="sm"
                color="secondary"
                variant="ghost"
                icon={RotateCw}
                onClick={() => refetch()}
              >
                Aggiorna
              </SimpleButton>

              {showEditSwitch && (
                <Switch
                  size="md"
                  color="primary"
                  checked={editMode}
                  onChange={handleToggleEdit}
                  label={
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      Modifica {editMode ? "attiva" : "disattiva"}
                    </span>
                  }
                  labelPosition="right"
                  title="Attiva/disattiva la modalità modifica"
                />
              )}
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
