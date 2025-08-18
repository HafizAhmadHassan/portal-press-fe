import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/Pill.module.scss';

type Props = {
  selected: string;
  options: string[];
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
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<{ left: number; top: number; width: number; height: number }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  // aggiorna posizione/width dalla pill
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
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };

    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey);

    // chiudi click esterno
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!triggerRef.current?.contains(t)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);

    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDoc);
    };
  }, [open]);

  const handleSelect = (value: string) => {
    onChange(value);
    setOpen(false);
  };

  const portalEl = useMemo(() => {
    let el = document.getElementById('kgn-portal-root') as HTMLDivElement | null;
    if (!el) {
      el = document.createElement('div');
      el.id = 'kgn-portal-root';
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
        <span className={styles.pillSelectValue}>{selected}</span>
        {ChevronIcon}
      </button>

      {/* Dropdown a larghezza intera (PORTAL) */}
      {open &&
        createPortal(
          <div
            className={styles.dropdownPortal}
            style={{
              position: 'fixed',
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
                  key={opt}
                  className={`${styles.dropdownItem} ${
                    opt === selected ? styles.dropdownItemActive : ''
                  }`}
                  onClick={() => handleSelect(opt)}
                  role="option"
                  aria-selected={opt === selected}
                >
                  {opt}
                </li>
              ))}
            </ul>
          </div>,
          portalEl
        )}
    </>
  );
}
