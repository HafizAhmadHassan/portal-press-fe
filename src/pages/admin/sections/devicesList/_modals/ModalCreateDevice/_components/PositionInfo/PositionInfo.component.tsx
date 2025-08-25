import styles from '../../../../_styles/Sections.module.scss';
import { MapPin } from 'lucide-react';
import { Input } from '@shared/inputs/Input.component.tsx';

export default function PositionInfo({
  formData,
  isLoading,
  handleInputChange,
  generateFullAddress,
}: any) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <MapPin className={styles.sectionIcon} />
        <h4 className={styles.sectionTitle}>Informazioni di Posizione</h4>
        <span className={styles.sectionBadgeOptional}>Opzionale</span>
      </div>

      <div className={styles.sectionContent}>
      <div className={styles.formGrid}>
        <Input
          label="Via/Strada"
          name="street"
          value={formData.street}
          onChange={(e) => {
            handleInputChange('street', e.target.value);
            setTimeout(generateFullAddress, 0);
          }}
          placeholder="es. Via Roma 123"
          disabled={isLoading}
        />
        <Input
          label="CAP"
          name="postalCode"
          value={formData.postalCode}
          onChange={(e) => handleInputChange('postalCode', e.target.value)}
          placeholder="es. 12345"
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGrid}>
        <Input
          label="Città"
          name="city"
          value={formData.city}
          onChange={(e) => {
            handleInputChange('city', e.target.value);
            setTimeout(generateFullAddress, 0);
          }}
          placeholder="es. Milano"
          disabled={isLoading}
        />
        <Input
          label="Provincia"
          name="province"
          value={formData.province}
          onChange={(e) => {
            handleInputChange('province', e.target.value);
            setTimeout(generateFullAddress, 0);
          }}
          placeholder="es. MI"
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGrid}>
        <Input
          label="Paese"
          name="country"
          value={formData.country}
          onChange={(e) => handleInputChange('country', e.target.value)}
          placeholder="es. Italia"
          disabled={isLoading}
        />
        <Input
          label="Comune"
          name="municipality"
          value={formData.municipality}
          onChange={(e) => handleInputChange('municipality', e.target.value)}
          placeholder="es. Milano"
          disabled={isLoading}
        />
      </div>

      <div className={styles.fullWidth}>
      <Input
        label="Indirizzo Completo"
        name="address"
        value={formData.address}
        onChange={(e) => handleInputChange('address', e.target.value)}
        placeholder="Generato automaticamente o inserisci manualmente"
        disabled={isLoading}
      />
      </div>

      <div className={styles.formGrid}>
        <Input
          label="GPS X"
          name="gpsX"
          value={formData.gpsX}
          onChange={(e) => handleInputChange('gpsX', e.target.value)}
          placeholder="es. 45.4642"
          disabled={isLoading}
        />
        <Input
          label="GPS Y"
          name="gpsY"
          value={formData.gpsY}
          onChange={(e) => handleInputChange('gpsY', e.target.value)}
          placeholder="es. 9.1900"
          disabled={isLoading}
        />
      </div>
    </div>
    </div>
  );
}
