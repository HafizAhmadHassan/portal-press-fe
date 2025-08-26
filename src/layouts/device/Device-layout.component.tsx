// DeviceLayout.tsx (estratto)
import { Outlet, useParams, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
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

  // Edit mode switch controllato dall’URL
  const isEditRoute = location.pathname.endsWith("/edit");
  const [editMode, setEditMode] = useState<boolean>(isEditRoute);

  useEffect(() => {
    setEditMode(isEditRoute);
  }, [isEditRoute]);

  const handleToggleEdit = (on: boolean) => {
    setEditMode(on);
    if (!device?.id) return;
    navigate(on ? `/device/${device.id}/edit` : `/device/${device.id}`);
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
          <div className={styles.pageHeader}>
            <button
              className={styles.backBtn}
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft size={18} />
              <span>Indietro</span>
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

              {/* 🔀 Switch al posto del bottone "Modifica" */}

              {user?.role === UserRoles.SUPER_ADMIN && (
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
                      Edit {editMode ? "attiva" : "disattiva"}
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
