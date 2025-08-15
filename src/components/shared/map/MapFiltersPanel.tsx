import styles from './styles/MapControls.module.scss';
import {LucideHome, Search} from "lucide-react";
import s from  './styles/MapFiltersPanel.module.scss'

interface Props {
    showActive: boolean;
    showInactive: boolean;
    toggleActive: () => void;
    toggleInactive: () => void;
    handleLocate: () => void;
}

const MapFiltersPanel = ({ showActive, showInactive, toggleActive, toggleInactive, handleLocate }: Props) => (
    <div className={styles.mapControls}>
       {/* <label>
            <input type="checkbox" checked={showActive} onChange={toggleActive} /> Attivi
        </label>
        <label>
            <input type="checkbox" checked={showInactive} onChange={toggleInactive} /> Inattivi
        </label>*/}
        <button onClick={handleLocate} className={s.goHomeLocation}>
            <LucideHome size={18} />
            <span className={s.goHomeLocationLabel}>
                Vai alla mia posizione
            </span>
        </button>
    </div>
);

export default MapFiltersPanel;