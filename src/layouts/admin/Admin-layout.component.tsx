// AdminLayout.tsx - Versione finale con DeviceCard composable
import { Outlet } from 'react-router-dom';
import LogoKgn from '@assets/images/kgn-logo.png';
import styles from './Admin-layout.module.scss';
import Header from '@shared/header/Header.component.tsx';
import SideNav from '@shared/side-navbar/SideNavbar.component.tsx';
import { AdminLayoutSideNavItems } from '@layouts/admin/_utils/SideNavItems.tsx';


export default function AdminLayout() {

    return (
      <div className={styles.layout}>
          <Header/>

          <div className={styles.body}>
              <SideNav
                menuItems={AdminLayoutSideNavItems}
                brand={{
                    logo: LogoKgn,
                    title: 'KGN srl',
                    subtitle: 'Admin Panel',
                }}
                showCollapseButton={true}
                showMobileToggle={true}
              />

              <main className={`${styles.content} `}>
                 <Outlet />
              </main>
          </div>
      </div>
    );
}