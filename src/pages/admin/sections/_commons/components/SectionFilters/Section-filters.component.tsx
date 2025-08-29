import React, { useMemo } from "react";
import styles from "./Section-filters.module.scss";
import { Input } from "@shared/inputs/Input.component.tsx";
import { Select } from "@shared/select/Select.component.tsx";
import {
  Accordion,
  type AccordionItemType,
} from "@shared/accordion/Accordion.component.tsx";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import { Filter, RotateCcwIcon } from "lucide-react";
import type { FilterConfig } from "@utils/types/filters.types.ts";

type SectionFilterProps = {
  filters: FilterConfig[];
  onResetFilters: () => void;
  isLoading?: boolean;
};

export const SectionFilterComponent: React.FC<SectionFilterProps> = ({
  filters,
  onResetFilters,
  isLoading = false,
}) => {
  // 1. Conta quanti filtri hanno un valore “non vuoto”
  const activeFiltersCount = useMemo(() => {
    return filters.reduce((count, f) => {
      const hasValue =
        f.type === "select"
          ? f.value !== "" && f.value != null
          : f.type === "email" || f.type === "text"
          ? typeof f.value === "string" && f.value.trim() !== ""
          : false;

      return hasValue ? count + 1 : count;
    }, 0);
  }, [filters]);

  // 2. Se ne serve solo il booleano, puoi riutilizzare così:
  const hasActiveFilters = activeFiltersCount > 0;

  const renderFilterField = (filter: FilterConfig) => {
    switch (filter.type) {
      case "select":
        return (
          <Select
            key={filter.key}
            label={filter.label}
            name={filter.name}
            placeholder={filter.placeholder}
            value={filter.value ?? ""}
            onChange={(value) => filter.onChange(String(value))}
            options={filter.options || []}
            disabled={filter.disabled || isLoading}
            icon={filter.icon}
            iconPosition={filter.iconPosition}
          />
        );
      case "email":
      case "text":
      default:
        return (
          <Input
            key={filter.key}
            label={filter.label}
            name={filter.name}
            placeholder={filter.placeholder}
            type={filter.type === "email" ? "email" : "text"}
            value={filter.value ?? ""}
            onChange={(e) =>
              filter.onChange(e as React.ChangeEvent<HTMLInputElement>)
            }
            required={filter.required}
            icon={filter.icon}
            iconPosition={filter.iconPosition}
          />
        );
    }
  };

  const accordionItems: AccordionItemType[] = [
    {
      id: 1,
      title: `Filtri di Ricerca${
        hasActiveFilters ? ` (${activeFiltersCount})` : ""
      }`,
      icon: Filter,
      content: (
        <div className={styles.sectionFilter}>
          {filters.map(renderFilterField)}

          {hasActiveFilters && (
            <div className={styles.resetButtonWrapper}>
              <SimpleButton
                onClick={onResetFilters}
                variant="outline"
                color="danger"
                size="md"
                icon={RotateCcwIcon}
                iconPosition="left"
                disabled={isLoading}
              >
                Reset Filtri ({activeFiltersCount})
              </SimpleButton>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Accordion
      activeItems={activeFiltersCount}
      items={accordionItems}
      defaultOpenItems={[]}
      variant="default"
      size="md"
    />
  );
};
