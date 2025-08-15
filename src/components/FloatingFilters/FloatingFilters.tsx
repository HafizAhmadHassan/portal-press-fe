import React, { useState } from 'react';
import './FloatingFilters.scss';

interface FloatingFiltersProps {
    onViewChange?: (isMapView: boolean) => void;
    onStatusFilter?: (status: 'tutti' | 'attivi' | 'disattivati') => void;
    className?: string;
}

const FloatingFilters: React.FC<FloatingFiltersProps> = ({
                                                             onViewChange,
                                                             onStatusFilter,
                                                             className = ''
                                                         }) => {
    const [isMapView, setIsMapView] = useState<boolean>(true); // true = cards, false = table
    const [selectedStatus, setSelectedStatus] = useState<'tutti' | 'attivi' | 'disattivati'>('tutti');

    const handleViewToggle = () => {
        const newView = !isMapView;
        setIsMapView(newView);
        onViewChange?.(newView);
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const status = event.target.value as 'tutti' | 'attivi' | 'disattivati';
        setSelectedStatus(status);
        onStatusFilter?.(status);
    };

    return (
        <div className={`floating-filter ${className}`}>
            <div className="floating-filter__container">
                {/* Switch per vista mappa/lista */}
                <div className="floating-filter__view-switch">
                    <div className="floating-filter__switch">
                        <button
                            className={`floating-filter__switch-button ${isMapView ? 'floating-filter__switch-button--active' : ''}`}
                            onClick={handleViewToggle}
                            aria-label="Vista cards"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <button
                            className={`floating-filter__switch-button ${!isMapView ? 'floating-filter__switch-button--active' : ''}`}
                            onClick={handleViewToggle}
                            aria-label="Vista tabella"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M3 6h18M3 12h18M3 18h18"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Filtro per stato */}
                <div className="floating-filter__status-filter">
                    <select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        className="floating-filter__select"
                    >
                        <option value="tutti">Tutti</option>
                        <option value="attivi">Attivi</option>
                        <option value="disattivati">Disattivati</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FloatingFilters;