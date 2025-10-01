// KgnHeader.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles/Header.module.scss";
import stylesPill from "./styles/Pill.module.scss";
import stylesToggle from "./styles/Header.module.scss";

import { setCustomer } from "@store_admin/scope/scope.slice";
import { reactToGlobalSearch } from "@store_admin/devices/devices.thunks";
import { setGlobalSearchQuery } from "@root/store/globalSearch.slice";
import { selectDevicesGlobalSearchLoading } from "@store_admin/devices/devices.selectors";
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
import { useSideBar } from "@store_admin/hooks/useSideBar";

export default function KgnHeader() {
  const searchText = useAppSelector((s) => s.globalSearch.query);
  const [localSearch, setLocalSearch] = useState(searchText);
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobile, closeMobile } =
    useSideBar();
  const isSearching = useAppSelector(selectDevicesGlobalSearchLoading);

  const dispatch = useAppDispatch();
  const scopedCustomer = useAppSelector(selectScopedCustomer);

  const { customers: customerNames } = useCustomers();
  const customerOptions = useMemo(
    () => [
      {
        value: "",
        label: scopedCustomer ? "Tutti" : "Filtra per cliente",
      },
      ...customerNames.map((n) => ({ value: n, label: n })),
    ],
    [customerNames, scopedCustomer]
  );
  const pillRef = useRef<HTMLDivElement>(null);
  const mobilePillRef = useRef<HTMLDivElement>(null);

  const debounceBase = useAppSelector((s) => s.globalSearch.debounceMs);

  // Effetto debounce centralizzato usando debounceMs dello slice (mobile più lento)
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const delay = isMobile ? Math.round(debounceBase * 1.4) : debounceBase; // es. 550 -> 770ms mobile
    const h = setTimeout(() => {
      const trimmed = localSearch.trim();
      setDebouncedSearch(trimmed);
      dispatch(setGlobalSearchQuery(trimmed));
    }, delay);
    return () => clearTimeout(h);
  }, [localSearch, debounceBase, dispatch]);

  // Trigger caricamento devices quando cambia il testo debounced
  useEffect(() => {
    // Sempre pagina 1 quando cambia ricerca
    dispatch(reactToGlobalSearch(debouncedSearch || ""));
  }, [debouncedSearch, dispatch]);

  const handleSearch = () => {
    // Forza immediatamente l'aggiornamento senza attendere debounce
    setDebouncedSearch(localSearch.trim());
    dispatch(setGlobalSearchQuery(localSearch.trim()));
    if (isMobileOpen) closeMobile();
    setIsMobileSearchOpen(false);
  };

  const clearSearch = () => {
    setLocalSearch("");
    setDebouncedSearch("");
    dispatch(setGlobalSearchQuery(""));
    dispatch(reactToGlobalSearch(""));
  };

  const handleCustomerChange = (value: string) => {
    dispatch(setCustomer(value || null));
    if (isMobileOpen) closeMobile();
  };

  const getToggleIcon = () =>
    isMobileOpen ? <X size={20} /> : <Menu size={20} />;

  const handleToggleClick = () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) toggleMobile();
    else toggleSidebar();
  };

  const handleMobileSearchToggle = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  const closeMobileSearch = () => {
    setIsMobileSearchOpen(false);
  };

  return (
    <>
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
              openUpward={false}
            />
            <div className={stylesPill.searchWrapper}>
              <SearchInput
                value={localSearch}
                onChange={setLocalSearch}
                onSearch={handleSearch}
                SearchIcon={<Search size={16} />}
              />
              <button
                type="button"
                className={`${stylesPill.clearBtn} ${
                  localSearch ? stylesPill.clearVisible : ""
                }`}
                aria-label={localSearch ? "Pulisci ricerca" : "Nessun testo"}
                onClick={clearSearch}
                disabled={!localSearch || isSearching}
              >
                {isSearching ? (
                  <svg
                    className={stylesPill.spinnerIcon}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" opacity="0.25" />
                    <path d="M22 12a10 10 0 0 1-10 10" />
                  </svg>
                ) : (
                  <X size={14} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile search button */}
        <button
          className={styles.mobileSearchBtn}
          onClick={handleMobileSearchToggle}
          aria-label="Search"
          title="Open search"
        >
          <Search size={20} />
        </button>

        <UserActions
          MailIcon={<Mail size={20} />}
          GridIcon={<Grid size={20} />}
        />
      </header>

      {/* Mobile search overlay */}
      {isMobileSearchOpen && (
        <>
          <div
            className={styles.mobileSearchOverlay}
            onClick={closeMobileSearch}
          />
          <div className={styles.mobileSearchPanel}>
            <div className={styles.mobileSearchContent}>
              <div className={styles.mobileSearchHeader}>
                <h3>Ricerca</h3>
                <button
                  className={styles.mobileSearchClose}
                  onClick={closeMobileSearch}
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </div>
              <div className={stylesPill.pill} ref={mobilePillRef}>
                <FilterSelect
                  selected={scopedCustomer ?? ""}
                  options={customerOptions}
                  onChange={handleCustomerChange}
                  ChevronIcon={<ChevronDown size={16} />}
                  anchorRef={mobilePillRef}
                  openUpward={true}
                />
                <div className={stylesPill.searchWrapper}>
                  <SearchInput
                    value={localSearch}
                    onChange={setLocalSearch}
                    onSearch={handleSearch}
                    SearchIcon={<Search size={16} />}
                  />
                  <button
                    type="button"
                    className={`${stylesPill.clearBtn} ${
                      localSearch ? stylesPill.clearVisible : ""
                    }`}
                    aria-label={
                      localSearch ? "Pulisci ricerca" : "Nessun testo"
                    }
                    onClick={clearSearch}
                    disabled={!localSearch || isSearching}
                  >
                    {isSearching ? (
                      <svg
                        className={stylesPill.spinnerIcon}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" opacity="0.25" />
                        <path d="M22 12a10 10 0 0 1-10 10" />
                      </svg>
                    ) : (
                      <X size={14} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
