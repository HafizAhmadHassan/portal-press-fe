import React, { useState } from 'react';
import { useSidebar } from '@store_admin/hooks/useSidebar';
import FilterSelect from './components/FilterSelect.component.tsx';
import SearchInput from './components/SearchInput';
import UserActions from './components/UserActions';
import styles from './styles/Header.module.scss';
import stylesToggle from './styles/Header.module.scss';
import stylesPill from './styles/Pill.module.scss';
import { ChevronDown, Grid, Mail, Menu, Search, X } from 'lucide-react';

export default function KgnHeader() {
  const [selectedFilter, setSelectedFilter] = useState('Tutti');
  const [searchText, setSearchText] = useState('');
  const filterOptions = ['Tutti', 'Dispositivi', 'Utenti', 'Configurazioni'];


  const {
    isMobileOpen,
    isSidebarCollapsed,
    toggleSidebar,
    toggleMobile,
    closeMobile,
  } = useSidebar();

  const handleSearch = () => {
    if (searchText.trim()) {
      console.log('Search triggered:', {
        filter: selectedFilter,
        query: searchText,
      });


      if (isMobileOpen) {
        closeMobile();
      }
    }
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    if (searchText.trim()) {
      handleSearch();
    }
  };


  const getToggleIcon = () => {
    if (isMobileOpen) return <X size={20} />;
    return <Menu size={20} />;
  };


  const handleToggleClick = () => {

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      toggleMobile();
    } else {
      toggleSidebar();
    }
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
        <div className={stylesPill.pill}>
          <FilterSelect
            selected={selectedFilter}
            options={filterOptions}
            onChange={handleFilterChange}
            ChevronIcon={<ChevronDown size={16} />}
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