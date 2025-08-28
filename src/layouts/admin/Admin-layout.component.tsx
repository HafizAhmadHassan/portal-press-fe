// AdminLayout.tsx - badge "Machines" = numero dispositivi INATTIVI (status === 0)
import { useMemo } from "react";
import { Outlet } from "react-router-dom";
import styles from "../_commons/_styles/LayoutStyles_commons.module.scss";
import LogoKgn from "@assets/images/kgn-logo.png";
import Header from "@shared/header/Header.component.tsx";
import SideNav from "@shared/side-navbar/SideNavbar.component.tsx";
import { buildAdminLayoutSideNavItems } from "./_utils/SideNavItems";

export default function AdminLayout() {
  // altri badge

  const machinesBadgeCount = undefined;
  const usersCount = undefined;
  const ticketsCount = undefined;
  const gpsCount = undefined;
  const logsCount = undefined;

  const sideNavItems = useMemo(
    () =>
      buildAdminLayoutSideNavItems({
        machines: machinesBadgeCount,
        users: usersCount,
        tickets: ticketsCount,
        gps: gpsCount,
        logs: logsCount,
      }),
    [machinesBadgeCount, usersCount, ticketsCount, gpsCount, logsCount]
  );

  return (
    <div className={styles.layout}>
      <Header />

      <div className={styles.body}>
        <SideNav
          menuItems={sideNavItems}
          brand={{
            logo: LogoKgn,
            title: "KGN srl",
            subtitle: "Admin Panel",
          }}
          showCollapseButton
          showMobileToggle
        />

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
