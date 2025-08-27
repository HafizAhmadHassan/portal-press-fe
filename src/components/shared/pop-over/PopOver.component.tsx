import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./PopOver.module.scss";

export type PopOverPlacement = "top" | "bottom" | "left" | "right";
export type PopOverAlign = "start" | "center" | "end";

export interface PopOverItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
}

interface PopOverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  items: PopOverItem[];
  headerLabel?: string;
  placement?: PopOverPlacement; // default: "top"
  align?: PopOverAlign; // default: "end"
  offset?: number; // default: 8
  /** Se true, chiude il menu automaticamente dopo la selezione */
  closeOnSelect?: boolean; // default: true
  className?: string;
}

export const PopOver: React.FC<PopOverProps> = ({
  anchorEl,
  open,
  onClose,
  items,
  headerLabel,
  placement = "top",
  align = "end",
  offset = 8,
  closeOnSelect = true,
  className,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: -9999,
    left: -9999,
  });
  const [arrowCoords, setArrowCoords] = useState<{ top: number; left: number }>(
    { top: -9999, left: -9999 }
  );

  // Calcola la posizione del menu rispetto all'anchor
  const computePosition = () => {
    if (!anchorEl || !menuRef.current) return;

    const anchorRect = anchorEl.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    // Allineamento orizz/vert in base a placement
    if (placement === "top" || placement === "bottom") {
      // Orizzontale: align
      if (align === "start") left = anchorRect.left;
      else if (align === "center")
        left = anchorRect.left + (anchorRect.width - menuRect.width) / 2;
      else left = anchorRect.right - menuRect.width;

      if (placement === "top") top = anchorRect.top - menuRect.height - offset;
      else top = anchorRect.bottom + offset;
    } else {
      // Left / Right
      if (align === "start") top = anchorRect.top;
      else if (align === "center")
        top = anchorRect.top + (anchorRect.height - menuRect.height) / 2;
      else top = anchorRect.bottom - menuRect.height;

      if (placement === "left")
        left = anchorRect.left - menuRect.width - offset;
      else left = anchorRect.right + offset;
    }

    // Piccolo clamping al viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v));

    const finalLeft = clamp(left, 8, vw - menuRect.width - 8);
    const finalTop = clamp(top, 8, vh - menuRect.height - 8);

    setCoords({ top: finalTop, left: finalLeft });

    // Posizione della freccia
    if (arrowRef.current) {
      const arrowSize = 10; // come in css
      let aTop = 0;
      let aLeft = 0;

      if (placement === "top") {
        aTop = anchorRect.top - arrowSize / Math.SQRT2 - 1; // un filo sopra
        if (align === "start") aLeft = anchorRect.left + 16;
        else if (align === "center")
          aLeft = anchorRect.left + anchorRect.width / 2 - arrowSize / 2;
        else aLeft = anchorRect.right - 16 - arrowSize;
      } else if (placement === "bottom") {
        aTop = anchorRect.bottom - arrowSize / Math.SQRT2 + 1;
        if (align === "start") aLeft = anchorRect.left + 16;
        else if (align === "center")
          aLeft = anchorRect.left + anchorRect.width / 2 - arrowSize / 2;
        else aLeft = anchorRect.right - 16 - arrowSize;
      } else if (placement === "left") {
        aLeft = anchorRect.left - arrowSize / Math.SQRT2 - 1;
        aTop = anchorRect.top + anchorRect.height / 2 - arrowSize / 2;
      } else {
        aLeft = anchorRect.right - arrowSize / Math.SQRT2 + 1;
        aTop = anchorRect.top + anchorRect.height / 2 - arrowSize / 2;
      }

      setArrowCoords({
        top: clamp(aTop, 0, vh - arrowSize),
        left: clamp(aLeft, 0, vw - arrowSize),
      });
    }
  };

  // Recompute quando si apre e su resize/scroll
  useLayoutEffect(() => {
    if (!open) return;
    computePosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, placement, align, offset, anchorEl]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => computePosition();
    const onResize = () => computePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Click fuori
  useEffect(() => {
    if (!open) return;

    const onDocMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (anchorEl?.contains(target)) return;
      onClose();
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open, onClose, anchorEl]);

  if (!open) return null;

  return createPortal(
    <div className={styles.wrapper} aria-hidden>
      <div
        ref={menuRef}
        className={[styles.menu, className].filter(Boolean).join(" ")}
        role="menu"
        style={{ top: coords.top, left: coords.left }}
      >
        {headerLabel ? (
          <div className={styles.header}>{headerLabel}</div>
        ) : null}
        <div className={styles.list} role="none">
          {items.map((item) => (
            <button
              key={item?.key}
              className={styles.item}
              role="menuitem"
              type="button"
              disabled={item?.disabled}
              onClick={() => {
                item?.onSelect?.();
                if (closeOnSelect) onClose();
              }}
            >
              {item?.icon ? (
                <span className={styles.itemIcon}>{item?.icon}</span>
              ) : null}
              <span className={styles.itemLabel}>{item?.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Freccia del popOver */}
      <div
        ref={arrowRef}
        className={styles.arrow}
        style={{ top: arrowCoords.top, left: arrowCoords.left }}
      />
    </div>,
    document.body
  );
};
