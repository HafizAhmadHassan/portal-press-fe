import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../styles/Pill.module.scss";

type Option = { value: string; label: string };

type Props = {
  selected: string; // <-- value selezionato
  options: Option[];
  onChange: (value: string) => void;
  ChevronIcon: React.ReactNode;
  /** ref del contenitore .pill (o .searchGroup) per calcolare left/top/width */
  anchorRef: React.RefObject<HTMLElement>;
};

export default function FilterSelect({
  selected,
  options,
  onChange,
  ChevronIcon,
  anchorRef,
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
    setRect({ left: r.left, top: r.bottom, width: r.width, height: r.height });
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

    // chiudi click esterno (ma non se clicco trigger o dropdown)
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
  }, [open]);

  const handleSelect = (value: string) => {
    onChange(value);
    setOpen(false);
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
      {/* Trigger “finto select” dentro la pill */}
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

      {/* Dropdown a larghezza intera (PORTAL) */}
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className={styles.dropdownPortal}
            style={{
              position: "fixed",
              left: rect.left,
              top: rect.top + 4, // piccolo gap
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
