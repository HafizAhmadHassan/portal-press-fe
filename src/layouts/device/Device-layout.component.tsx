// DeviceLayout.tsx
import { Outlet, useParams, useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { ArrowLeft, Pencil, RotateCw, User } from "lucide-react";
import LogoKgn from "@assets/images/kgn-logo.png";
import styles from "./Device-layout.module.scss";
import Header from "@shared/header/Header.component.tsx";
import SideNav from "@shared/side-navbar/SideNavbar.component.tsx";
import { deviceLayoutSideNavItems } from "@layouts/device/_utils/SideNavItems.tsx";
import { SimpleButton } from "@root/components/shared/simple-btn/SimpleButton.component";
import { useGetDeviceByIdQuery } from "@root/pages/admin/core/store/devices/devices.api";
import { useSession } from "@root/pages/admin/core/store/auth/hooks/useSession";
import { UserRoles } from "@root/utils/constants/userRoles";

export default function DeviceLayout() {
  const navigate = useNavigate();

  const { deviceId, id } = useParams<{ deviceId?: string; id?: string }>();
  const location = useLocation();

  const { user } = useSession();

  const pathId = useMemo(() => {
    const match = location.pathname.match(/\/device\/([^/]+)/);
    return match?.[1];
  }, [location.pathname]);

  const currentDeviceId = deviceId ?? id ?? pathId;

  const menuItems = useMemo(
    () => deviceLayoutSideNavItems(currentDeviceId),
    [currentDeviceId]
  );

  const parsedId = deviceId ? Number(deviceId) : undefined;
  const { data: device, refetch } = useGetDeviceByIdQuery(parsedId!, {
    skip: !parsedId,
  });

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
              <span>Torna a tutti i dispositivi</span>
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

              {user?.role === UserRoles.SUPER_ADMIN && device && (
                <SimpleButton
                  size="sm"
                  color="primary"
                  icon={Pencil}
                  onClick={() => navigate(`/device/${device?.id}/edit`)}
                >
                  Modifica
                </SimpleButton>
              )}
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
