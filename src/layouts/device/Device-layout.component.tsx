import {
  Outlet,
  useParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useMemo, useEffect } from "react";
import LogoKgn from "@assets/images/kgn-logo.png";
import Header from "@shared/header/Header.component.tsx";
import { UserRoles } from "@root/utils/constants/userRoles";
import { useGetPlcByIdQuery } from "@root/pages/device/store/plc";
import SideNav from "@shared/side-navbar/SideNavbar.component.tsx";
import styles from "../_commons/_styles/LayoutStyles_commons.module.scss";
import { PageHeader } from "./_components/PageHeader/PageHeader.component";
import { useSession } from "@root/pages/admin/core/store/auth/hooks/useSession";
import { deviceLayoutSideNavItems } from "@layouts/device/_utils/SideNavItems.tsx";
import { useGetDeviceByIdQuery } from "@root/pages/admin/core/store/devices/devices.api";

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
    () => deviceLayoutSideNavItems(Number(currentDeviceId)),
    [currentDeviceId]
  );

  const parsedId = deviceId ? Number(deviceId) : undefined;
  const { refetch } = useGetDeviceByIdQuery(parsedId!, {
    skip: !parsedId,
  });

  // ========= CHIAMATA API PLC /plc/:id =========
  const {
    data: plcDetail,
    isLoading: plcLoading,
    error: plcError,
    refetch: refetchPlc,
  } = useGetPlcByIdQuery(Number(currentDeviceId), {
    skip: !currentDeviceId,
  });

  useEffect(() => {
    if (plcLoading) return;
    if (plcError) {
      console.error("[PLC] errore dettaglio:", plcError);
      return;
    }
    if (plcDetail) {
      console.log("[PLC] dettaglio →", plcDetail);
    }
  }, [plcDetail, plcLoading, plcError]);
  // ========= FINE CHIAMATA API PLC =========

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
  }, [location.pathname, searchParams, setSearchParams]);

  const handleToggleEdit = (on: boolean) => {
    const next = new URLSearchParams(searchParams);
    if (on) next.set("edit", "1");
    else next.delete("edit");
    setSearchParams(next, { replace: true });
  };

  // =========================
  // VISIBILITÀ SWITCH "MODIFICA"
  // =========================
  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;

  const isDetailPage = useMemo(() => {
    const afterId = location.pathname.replace(/^.*\/device\/[^/]+/, "");
    return (
      afterId === "" ||
      afterId === "/" ||
      afterId === "/edit" ||
      afterId === "/edit/"
    );
  }, [location.pathname]);

  const showEditSwitch = useMemo(() => {
    if (isSuperAdmin) return isDetailPage;
    return !isDetailPage;
  }, [isSuperAdmin, isDetailPage]);

  const refetchAll = () => {
    refetch();
    refetchPlc();
  };

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
          <PageHeader
            editMode={editMode}
            showEditSwitch={showEditSwitch}
            onToggleEdit={handleToggleEdit}
            refetch={refetchAll}
            navigateTo={() => navigate("/admin")}
          />

          <Outlet />
        </main>
      </div>
    </div>
  );
}
