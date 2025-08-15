import React from 'react';
import { type LucideIcon } from 'lucide-react';
import styles from './Section-header.module.scss';
import { SimpleButton } from '@shared/simple-btn/SimpleButton.component.tsx';

type ButtonConfig = {
  onClick: () => void;
  variant?: 'filled' | 'outline';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  label: string;
  disabled?: boolean;
};

type ComponentConfig = {
  component: React.ReactNode;
};

type ActionItem = ButtonConfig | ComponentConfig;

type SectionHeaderProps = {
  title: string;
  subTitle?: string;
  buttons?: ActionItem[];
};

const isButtonConfig = (item: ActionItem): item is ButtonConfig =>
  'onClick' in item && 'label' in item;

const isComponentConfig = (item: ActionItem): item is ComponentConfig =>
  'component' in item;

export const SectionHeaderComponent: React.FC<SectionHeaderProps> = ({
  title = 'Title test',
  subTitle = 'Subtitle test',
  buttons = [],
}) => {
  return (
    <div className={styles.sectionHeader}>
      <div className={styles.sectionHeaderContent}>
        <div className={styles.sectionHeaderTitleSection}>
          <h1 className={styles.sectionHeaderTitle}>{title}</h1>
          {subTitle && <p className={styles.sectionHeaderSubtitle}>{subTitle}</p>}
        </div>
        <div className={styles.sectionHeaderActions}>
          {buttons?.map((item, index) => {
            if (isComponentConfig(item)) {
              return (
                <div key={`component-${index}`} className={styles.customComponent}>
                  {item.component}
                </div>
              );
            }
            if (isButtonConfig(item)) {
              return (
                <SimpleButton
                  key={`button-${index}`}
                  onClick={item.onClick}
                  variant={item.variant || 'filled'}
                  color={item.color || 'primary'}
                  size={item.size || 'md'}
                  icon={item.icon}
                  iconPosition={item.iconPosition || 'left'}
                  disabled={item.disabled || false}
                >
                  {item.label}
                </SimpleButton>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};
