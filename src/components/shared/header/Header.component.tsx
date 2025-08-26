// KgnHeader.tsx
import { useMemo, useRef, useState } from "react";
import styles from "./styles/Header.module.scss";
import stylesPill from "./styles/Pill.module.scss";
import stylesToggle from "./styles/Header.module.scss";
import { useSidebar } from "@store_admin/hooks/useSidebar";
import { setCustomer } from "@store_admin/scope/scope.slice";
import { ChevronDown, Grid, Mail, Menu, Search, X } from "lucide-react";
import { selectScopedCustomer } from "@store_admin/scope/scope.selectors";
import UserActions from "@root/components/shared/header/components/UserActions";
import SearchInput from "@root/components/shared/header/components/SearchInput";
import { useCustomers } from "@root/pages/admin/core/store/customers/hooks/useCustomers";
import FilterSelect from "@root/components/shared/header/components/FilterSelect.component";

import {
  useAppDispatch,
  useAppSelector,
} from "@root/pages/admin/core/store/store.hooks";

export default function KgnHeader() {
  const [searchText, setSearchText] = useState("");
  const { isMobileOpen, toggleSidebar, toggleMobile, closeMobile } =
    useSidebar();

  const dispatch = useAppDispatch();
  const scopedCustomer = useAppSelector(selectScopedCustomer);

  const { customers: customerNames } = useCustomers();
  const customerOptions = useMemo(
    () => [
      { value: "", label: "Tutti" },
      ...customerNames.map((n) => ({ value: n, label: n })),
    ],
    [customerNames]
  );

  const pillRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (!searchText.trim()) return;
    if (isMobileOpen) closeMobile();
  };

  const handleCustomerChange = (value: string) => {
    dispatch(setCustomer(value || null));
    console.log("Customer changed:", value || "(Tutti)");
    if (isMobileOpen) closeMobile();
  };

  const getToggleIcon = () =>
    isMobileOpen ? <X size={20} /> : <Menu size={20} />;
  const handleToggleClick = () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) toggleMobile();
    else toggleSidebar();
  };

  return (
    <header className={styles.kgnHeader}>
      <button
        className={stylesToggle.toggleBtn}
        onClick={handleToggleClick}
        aria-label="Menu"
        title={isMobileOpen ? "Close menu" : "Open menu"}
      >
        {getToggleIcon()}
      </button>

      <div className={stylesPill.searchGroup}>
        <div className={stylesPill.pill} ref={pillRef}>
          <FilterSelect
            selected={scopedCustomer ?? ""}
            options={customerOptions}
            onChange={handleCustomerChange}
            ChevronIcon={<ChevronDown size={16} />}
            anchorRef={pillRef}
          />
          <SearchInput
            value={searchText}
            onChange={setSearchText}
            onSearch={handleSearch}
            SearchIcon={<Search size={16} />}
          />
        </div>
      </div>

      <UserActions
        MailIcon={<Mail size={20} />}
        GridIcon={<Grid size={20} />}
      />
    </header>
  );
}
