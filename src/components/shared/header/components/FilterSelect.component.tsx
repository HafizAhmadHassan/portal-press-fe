import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../styles/Pill.module.scss";

type Option = { value: string; label: string };

type Props = {
  selected: string;
  options: Option[];
  onChange: (value: string) => void;
  ChevronIcon: React.ReactNode;
  anchorRef: React.RefObject<HTMLElement>;
  openUpward?: boolean;
  onSelectionChange?: () => void; // Callback opzionale per force refresh
};

export default function FilterSelect({
  selected,
  options,
  onChange,
  ChevronIcon,
  anchorRef,
  openUpward = false,
  onSelectionChange,
}: Props) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const selectedLabel = useMemo(
    () => options.find((o) => o.value === selected)?.label ?? selected,
    [options, selected]
  );

  const updatePosition = () => {
    const anchor = anchorRef?.current;
    if (!anchor) return;
    const r = anchor.getBoundingClientRect();

    if (openUpward) {
      const dropdownHeight = Math.min(280, options.length * 60);
      setRect({
        left: r.left,
        top: r.top - dropdownHeight - 4,
        width: r.width,
        height: r.height,
      });
    } else {
      setRect({
        left: r.left,
        top: r.bottom,
        width: r.width,
        height: r.height,
      });
    }
  };

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);

    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      const inTrigger = !!triggerRef.current?.contains(t);
      const inDropdown = !!dropdownRef.current?.contains(t);
      if (!inTrigger && !inDropdown) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDoc);
    };
  }, [open, openUpward, options.length]);

  const handleSelect = (value: string) => {
    console.log("FilterSelect: Valore selezionato:", value);

    // Prima chiama onChange per aggiornare il state
    onChange(value);
    setOpen(false);

    // Poi chiama il callback opzionale per force refresh
    if (onSelectionChange) {
      console.log("FilterSelect: Triggering selection change callback");
      setTimeout(() => {
        onSelectionChange();
      }, 50); // Piccolo delay per permettere l'aggiornamento del state
    }
  };

  const portalEl = useMemo(() => {
    let el = document.getElementById(
      "kgn-portal-root"
    ) as HTMLDivElement | null;
    if (!el) {
      el = document.createElement("div");
      el.id = "kgn-portal-root";
      document.body.appendChild(el);
    }
    return el;
  }, []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.pillSelectBtn}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Filtro di ricerca"
      >
        <span className={styles.pillSelectValue}>{selectedLabel}</span>
        {ChevronIcon}
      </button>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className={styles.dropdownPortal}
            style={{
              position: "fixed",
              left: rect.left,
              top: rect.top + (openUpward ? 0 : 4),
              width: rect.width,
            }}
            role="listbox"
            aria-label="Filtro di ricerca"
          >
            <ul className={styles.dropdownList}>
              {options.map((opt) => (
                <li
                  key={opt.value}
                  className={`${styles.dropdownItem} ${
                    opt.value === selected ? styles.dropdownItemActive : ""
                  }`}
                  onClick={() => handleSelect(opt.value)}
                  role="option"
                  aria-selected={opt.value === selected}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          </div>,
          portalEl
        )}
    </>
  );
}
