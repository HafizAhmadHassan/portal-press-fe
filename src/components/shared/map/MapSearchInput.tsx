import { useMap } from 'react-leaflet';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { Search, X } from 'lucide-react';
import styles from './styles/MapSearchInput.module.scss';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search?format=json&q=';

const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

interface MapSearchInputProps {
    initialCenter: L.LatLngExpression;
    initialZoom: number;
}

const MapSearchInput = ({ initialCenter, initialZoom }: MapSearchInputProps) => {
    const map = useMap();
    const inputRef = useRef<HTMLDivElement>(null);

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [initialBounds, setInitialBounds] = useState<L.LatLngBoundsExpression | null>(null);

    useEffect(() => {
        setInitialBounds(map.getBounds());
    }, [map]);

    const searchLocation = async (q: string) => {
        if (!q) return;
        setLoading(true);
        try {
            const response = await fetch(`${NOMINATIM_URL}${encodeURIComponent(q)}`);
            const data = await response.json();
            setResults(data || []);
            if (q.length > 0) {
                setHasSearched(true);
            }
        } catch (e) {
            console.error('Geocoding error:', e);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useRef(debounce(searchLocation, 400)).current;

    useEffect(() => {
        debouncedSearch(query);
    }, [query]);

    const handleSelect = (item: any) => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        map.flyTo([lat, lon], 14);
        setResults([]);
        setQuery(item.display_name.split(',')[0]); // Mantieni il nome del luogo selezionato
        setExpanded(false);
        setHasSearched(true);
    };

    const handleReset = () => {
        setQuery('');
        setResults([]);
        setExpanded(false);
        setHasSearched(false);
        if (initialBounds) {
            map.flyToBounds(initialBounds, {
                animate: true,
                duration: 1.5,
                padding: [50, 50],
            });
        } else {
            map.flyTo(initialCenter, initialZoom, {
                animate: true,
                duration: 1.5,
            });
        }
    };

    const handleSearchToggle = () => {
        if (expanded) {
            // Chiude la ricerca
            setExpanded(false);
            setResults([]);
            setQuery('');
        } else {
            // Apre la ricerca
            setExpanded(true);
        }
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
            setExpanded(false);
            setResults([]);
        }
    };

    useEffect(() => {
        if (expanded) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [expanded]);

    return (
        <div className={styles.searchContainer}>
            {/* Pulsante reset separato - solo quando necessario */}
            {hasSearched && !expanded && (
                <button
                    className={styles.resetButton}
                    onClick={handleReset}
                    title="Reset vista mappa"
                >
                    <X size={18} />
                </button>
            )}

            {/* Campo di ricerca integrato con lente */}
            <div className={styles.searchWrapper} ref={inputRef}>
                <div className={`${styles.searchBox} ${expanded ? styles.expanded : ''}`}>
                    {/* Input espandibile */}
                    <input
                        type="text"
                        placeholder="Cerca un luogo..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className={`${styles.input} ${expanded ? styles.visible : ''}`}
                        onFocus={() => !expanded && setExpanded(true)}
                    />

                    {/* Pulsante toggle: lente quando chiuso, X quando aperto */}
                    <button
                        className={`${styles.searchButton} ${expanded ? styles.active : ''}`}
                        onClick={handleSearchToggle}
                        title={expanded ? "Chiudi ricerca" : "Cerca un luogo"}
                    >
                        {expanded ? <X size={18} /> : <Search size={18} />}
                    </button>
                </div>

                {/* Risultati della ricerca */}
                {expanded && (
                    <>
                        {loading && <div className={styles.loader} />}

                        {results.length > 0 && (
                            <ul className={styles.results}>
                                {results.slice(0, 8).map((r, i) => (
                                    <li key={i} onClick={() => handleSelect(r)}>
                                        <div className={styles.resultItem}>
                                            <span className={styles.resultName}>
                                                {r.display_name.split(',')[0]}
                                            </span>
                                            <span className={styles.resultDetails}>
                                                {r.display_name.split(',').slice(1, 3).join(',').trim()}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MapSearchInput;