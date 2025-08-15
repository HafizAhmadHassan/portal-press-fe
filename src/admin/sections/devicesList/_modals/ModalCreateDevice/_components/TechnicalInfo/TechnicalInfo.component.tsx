import styles from '../../../../_styles/Sections.module.scss';
import { Settings } from 'lucide-react';
import { Input } from '@shared/inputs/Input.component.tsx';

export default function TechnicalInfo({ formData, isLoading, handleInputChange, errors }: any) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <Settings className={styles.sectionIcon} />
        <h4 className={styles.sectionTitle}>Informazioni Tecniche</h4>
        <span className={styles.sectionBadgeOptional}>Opzionale</span>
      </div>

      <div className={styles.sectionContent}>
      <div className={styles.formGrid}>
        <Input
          label="IP Router"
          name="ipRouter"
          value={formData.ipRouter}
          onChange={(e) => handleInputChange('ipRouter', e.target.value)}
          placeholder="es. 192.168.1.1"
          disabled={isLoading}
          error={errors.ipRouter}
        />
        <Input
          label="Codice GPS"
          name="codiceGps"
          value={formData.codiceGps}
          onChange={(e) => handleInputChange('codiceGps', e.target.value)}
          placeholder="es. GPS001"
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGrid}>
        <Input
          label="Nome Foglio"
          name="sheetName"
          value={formData.sheetName}
          onChange={(e) => handleInputChange('sheetName', e.target.value)}
          placeholder="es. Foglio_001"
          disabled={isLoading}
        />
        <Input
          label="Matricola BTE"
          name="matricolaBte"
          value={formData.matricolaBte}
          onChange={(e) => handleInputChange('matricolaBte', e.target.value)}
          placeholder="es. BTE123456"
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGrid}>
        <Input
          label="Matricola KGN"
          name="matricolaKgn"
          value={formData.matricolaKgn}
          onChange={(e) => handleInputChange('matricolaKgn', e.target.value)}
          placeholder="es. KGN123456"
          disabled={isLoading}
        />
        <Input
          label="Nome Cliente"
          name="customerName"
          value={formData.customerName}
          onChange={(e) => handleInputChange('customerName', e.target.value)}
          placeholder="es. Cliente SpA"
          disabled={isLoading}
        />
      </div>
      <div className={styles.fullWidth}>
        <Input
          label="Cliente"
          name="customer"
          value={formData.customer}
          onChange={(e) => handleInputChange('customer', e.target.value)}
          placeholder="es. cliente_001"
          disabled={isLoading}
        />
      </div>
      <div className={styles.fullWidth}>
        <Input
          label="Note"
          name="note"
          value={formData.note}
          onChange={(e) => handleInputChange('note', e.target.value)}
          placeholder="Note aggiuntive..."
          disabled={isLoading}
          multiline
        />
      </div>
    </div>
    </div>
  );
}
