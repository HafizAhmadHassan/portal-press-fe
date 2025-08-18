import React, { useRef, useState } from 'react';
import { useSidebar } from '@store_admin/hooks/useSidebar';
import styles from './styles/Header.module.scss';
import stylesToggle from './styles/Header.module.scss';
import stylesPill from './styles/Pill.module.scss';
import { ChevronDown, Grid, Mail, Menu, Search, X } from 'lucide-react';
import UserActions from '@root/components/shared/header/components/UserActions';
import SearchInput from '@root/components/shared/header/components/SearchInput';
import FilterSelect from '@root/components/shared/header/components/FilterSelect.component';

export default function KgnHeader() {
  const [selectedFilter, setSelectedFilter] = useState('Tutti');
  const [searchText, setSearchText] = useState('');
  const filterOptions = ['Tutti', 'Dispositivi', 'Utenti', 'Configurazioni'];

  const { isMobileOpen, toggleSidebar, toggleMobile, closeMobile } = useSidebar();

  const pillRef = useRef<HTMLDivElement>(null); // <— ref della pill intera

  const handleSearch = () => {
    if (!searchText.trim()) return;
    console.log('Search triggered:', { filter: selectedFilter, query: searchText });
    if (isMobileOpen) closeMobile();
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    if (searchText.trim()) handleSearch();
  };

  const getToggleIcon = () => (isMobileOpen ? <X size={20} /> : <Menu size={20} />);

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
        title={isMobileOpen ? 'Close menu' : 'Open menu'}
      >
        {getToggleIcon()}
      </button>

      <div className={stylesPill.searchGroup}>
        <div className={stylesPill.pill} ref={pillRef}>
          <FilterSelect
            selected={selectedFilter}
            options={filterOptions}
            onChange={handleFilterChange}
            ChevronIcon={<ChevronDown size={16} />}
            anchorRef={pillRef}                     // <— ancora per il portal
          />
          <SearchInput
            value={searchText}
            onChange={setSearchText}
            onSearch={handleSearch}
            SearchIcon={<Search size={16} />}
          />
        </div>
      </div>

      <UserActions MailIcon={<Mail size={20} />} GridIcon={<Grid size={20} />} />
    </header>
  );
}
