import React from 'react';
import styles from '../styles/TableCell.module.scss';

interface TextConfig {
  overflow?: 'ellipsis' | 'wrap' | 'smart';
  maxLines?: number;
  maxWidth?: string;
  showTooltip?: boolean;
}

interface TableCellProps<T = any> {
  column: any;
  item: T;
  value: any;
}

export const TableCell = <T,>({ column, item, value }: TableCellProps<T>) => {
  const renderTextWithConfig = (text: string, textConfig?: TextConfig) => {
    if (!textConfig) return <span>{text}</span>;

    const {
      overflow = 'ellipsis',
      maxLines = 3,
      maxWidth = '100%',
      showTooltip = true
    } = textConfig;

    const base: React.CSSProperties = { maxWidth, overflow: 'hidden' };

    const wrap: React.CSSProperties = {
      ...base,
      wordWrap: 'break-word',
      whiteSpace: 'normal',
      maxHeight: `${maxLines * 1.5}em`,
      display: '-webkit-box',
      WebkitLineClamp: maxLines,
      WebkitBoxOrient: 'vertical' as any,
      textOverflow: 'ellipsis',
    };

    const single: React.CSSProperties = {
      ...base,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    };

    let style: React.CSSProperties = single;
    if (overflow === 'wrap') style = wrap;
    if (overflow === 'smart') style = (text || '').includes(' ') ? wrap : single;

    return (
      <div style={style} title={showTooltip ? text : undefined}>
        {text}
      </div>
    );
  };

  const renderContent = () => {
    switch (column.type) {
      case 'text':
      case 'email':
        return (
          <div className={styles.textCell}>
            {value ? renderTextWithConfig(value, column.textConfig) : <span className={styles.notAvailable}>N/A</span>}
          </div>
        );

      case 'avatar': {
        const avatarConfig = column.avatarConfig || {};
        const name = avatarConfig.nameField ? (item as any)[avatarConfig.nameField] : value;
        const email = avatarConfig.emailField ? (item as any)[avatarConfig.emailField] : null;
        const avatarUrl = avatarConfig.avatarField
          ? avatarConfig.avatarField.split('.').reduce((acc: any, key: string) => acc?.[key], item as any)
          : null;
        const size = avatarConfig.size || 'md';

        return (
          <div className={styles.avatarContainer}>
            <div className={styles.avatarWrapper}>
              {avatarUrl ? (
                <img className={`${styles.avatarImage} ${styles[size]}`} src={avatarUrl} alt={name || 'Avatar'} />
              ) : (
                <div className={`${styles.avatarPlaceholder} ${styles[size]}`}>
                  <span className={styles.placeholderText}>
                    {name ? name.charAt(0).toUpperCase() : email ? email.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              )}
            </div>
            <div className={styles.avatarInfo}>
              <div className={styles.avatarName}>
                {renderTextWithConfig(name || 'Nome non disponibile', avatarConfig.nameTextConfig)}
              </div>
              {email && <div className={styles.avatarEmail}>{renderTextWithConfig(email, avatarConfig.emailTextConfig)}</div>}
            </div>
          </div>
        );
      }

      case 'badge': {
        if (!column.badgeConfig) {
          return <span className={`${styles.badge} ${styles.default}`}>{String(value ?? 'N/A')}</span>;
        }
        const key = String(value).toLowerCase();
        const info = column.badgeConfig[key] || { label: String(value), className: 'default' };
        const classFromModule = (styles as any)[info.className] || styles.default;
        return <span className={`${styles.badge} ${classFromModule}`}>{info.label}</span>;
      }

      case 'select':
        if (!column.selectConfig) return value;
        return (
          <select
            value={value || ''}
            onChange={(e) => column.selectConfig?.onChange?.(item, e.target.value)}
            className={styles.selectInput}
          >
            {column.selectConfig.options.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'boolean': {
        const cfg = column.booleanConfig || {};
        const isTrue = Boolean(value);
        return (
          <span className={`${styles.booleanText} ${isTrue ? styles.true : styles.false}`}>
            {isTrue ? cfg.trueLabel || 'Sì' : cfg.falseLabel || 'No'}
          </span>
        );
      }

      case 'actions':
        if (!column.actions) return null;
        return (
          <div className={styles.actionsContainer}>
            {column.actions.map((action: any, index: number) => (
              <button
                key={index}
                onClick={() => action.onClick(item)}
                disabled={action.disabled?.(item)}
                className={`${styles.actionButton}`}
              >
                {action.icon && <span className={styles.actionIcon}>{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        );

      case 'custom':
        return column.render ? column.render(value, item) : value;

      default:
        return renderTextWithConfig(value || '', column.textConfig);
    }
  };

  return (
    <td className={styles.bodyCell} style={{ width: column.width }}>
      {renderContent()}
    </td>
  );
};