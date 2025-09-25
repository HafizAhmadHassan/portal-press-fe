import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./DropDown.module.scss";

export type DropdownPlacement = "top" | "bottom" | "left" | "right";
export type DropdownAlign = "start" | "center" | "end";

interface DropdownProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;

  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;

  placement?: DropdownPlacement; // default "bottom"
  align?: DropdownAlign; // default "end"
  offset?: number; // default 10
  width?: number | string; // optional forced width
  className?: string;
  contentClassName?: string;
  showArrow?: boolean; // default true
}

export const Dropdown: React.FC<DropdownProps> = ({
  anchorEl,
  open,
  onClose,
  header,
  footer,
  children,
  placement = "bottom",
  align = "end",
  offset = 10,
  width,
  className,
  contentClassName,
  showArrow = true,
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: -9999,
    left: -9999,
  });
  const [arrowCoords, setArrowCoords] = useState<{ top: number; left: number }>(
    { top: -9999, left: -9999 }
  );

  const computePosition = () => {
    if (!anchorEl || !panelRef.current) return;

    const a = anchorEl.getBoundingClientRect();
    const p = panelRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    if (placement === "top" || placement === "bottom") {
      if (align === "start") left = a.left;
      else if (align === "center") left = a.left + (a.width - p.width) / 2;
      else left = a.right - p.width;

      top = placement === "top" ? a.top - p.height - offset : a.bottom + offset;
    } else {
      if (align === "start") top = a.top;
      else if (align === "center") top = a.top + (a.height - p.height) / 2;
      else top = a.bottom - p.height;

      left =
        placement === "left" ? a.left - p.width - offset : a.right + offset;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v));

    setCoords({
      top: clamp(top, 8, vh - p.height - 8),
      left: clamp(left, 8, vw - p.width - 8),
    });

    if (arrowRef.current) {
      const s = 12;
      let at = 0,
        al = 0;
      if (placement === "top") {
        at = a.top - s / Math.SQRT2 - 1;
        if (align === "start") al = a.left + 20;
        else if (align === "center") al = a.left + a.width / 2 - s / 2;
        else al = a.right - 20 - s;
      } else if (placement === "bottom") {
        at = a.bottom - s / Math.SQRT2 + 1;
        if (align === "start") al = a.left + 20;
        else if (align === "center") al = a.left + a.width / 2 - s / 2;
        else al = a.right - 20 - s;
      } else if (placement === "left") {
        al = a.left - s / Math.SQRT2 - 1;
        at = a.top + a.height / 2 - s / 2;
      } else {
        al = a.right - s / Math.SQRT2 + 1;
        at = a.top + a.height / 2 - s / 2;
      }
      setArrowCoords({
        top: clamp(at, 0, vh - s),
        left: clamp(al, 0, vw - s),
      });
    }
  };

  useLayoutEffect(() => {
    if (!open) return;
    computePosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, anchorEl, placement, align, offset, width]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => computePosition();
    const onResize = () => computePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);

    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if (anchorEl?.contains(t)) return;
      onClose();
    };
    document.addEventListener("mousedown", onDown);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className={styles.wrapper} aria-hidden>
      <div
        ref={panelRef}
        className={[styles.panel, className].filter(Boolean).join(" ")}
        style={{ top: coords.top, left: coords.left, width }}
        role="dialog"
        aria-modal="true"
      >
        {header ? <div className={styles.header}>{header}</div> : null}
        <div
          className={[styles.content, contentClassName]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>

      {showArrow ? (
        <div
          ref={arrowRef}
          className={styles.arrow}
          style={{ top: arrowCoords.top, left: arrowCoords.left }}
        />
      ) : null}
    </div>,
    document.body
  );
};
