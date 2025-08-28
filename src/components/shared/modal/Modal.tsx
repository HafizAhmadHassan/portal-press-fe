import { X, type LucideIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import styles from "./Modal.module.scss";
import { SimpleButton } from "../simple-btn/SimpleButton.component";

interface ModalProps {
  triggerButton: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "bare";
  btnClassName?: string;
  modalClassName?: string;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: LucideIcon | undefined;
  onConfirm?: () => Promise<void> | void;
  children?: React.ReactNode;
  loading?: boolean;
  defaultActions?: {
    variantCancel?: "filled" | "outline" | "ghost";
    variantConfirm?: "filled" | "outline" | "ghost";
    colorCancel?: "primary" | "secondary" | "danger" | "success" | "warning";
    colorConfirm?: "primary" | "secondary" | "danger" | "success" | "warning";
  };
}

const Modal = ({
  size = "md",
  triggerButton,
  btnClassName,
  modalClassName,
  title,
  description,
  confirmText,
  cancelText,
  icon,
  onConfirm,
  children,
  loading = false,
  defaultActions = {
    variantConfirm: "outline",
    variantCancel: "outline",
    colorConfirm: "success",
    colorCancel: "warning",
  },
}: ModalProps) => {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClose = () => {
    if (isPending || loading) return;
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const handleConfirmClick = async () => {
    if (onConfirm) {
      setIsPending(true);
      try {
        await onConfirm();
        handleClose();
      } catch (error) {
        // non chiudere in caso di errore
        // eslint-disable-next-line no-console
        console.error("Errore durante la conferma:", error);
      } finally {
        setIsPending(false);
      }
    } else {
      handleClose();
    }
  };

  return (
    <>
      <div onClick={() => setOpen(true)} className={btnClassName}>
        {triggerButton}
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          open && (
            <div
              className={`${styles.overlay} ${
                isClosing ? styles["overlay--closing"] : ""
              }`}
              onClick={handleClose}
            >
              <div
                className={[
                  styles.content,
                  styles[`content--${size}`],
                  isClosing ? styles["content--closing"] : "",
                  modalClassName || "",
                  isPending || loading ? styles["content--loading"] : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleClose}
                  className={styles.closeBtn}
                  disabled={isPending || loading}
                  aria-label="Chiudi modale"
                >
                  <X className={styles.closeIcon} />
                </button>

                <div className={styles.body}>
                  {(title || icon) && (
                    <div className={styles.header}>
                      {icon && (
                        <div className={styles.icon}>
                          {React.createElement(icon)}
                        </div>
                      )}
                      {title && <h2 className={styles.title}>{title}</h2>}
                    </div>
                  )}

                  {description && (
                    <p className={styles.description}>{description}</p>
                  )}

                  {children && (
                    <div className={styles.children}>{children}</div>
                  )}

                  {(confirmText || cancelText) && (
                    <div className={styles.actions}>
                      {cancelText && (
                        <SimpleButton
                          variant={defaultActions?.variantCancel}
                          onClick={handleClose}
                          disabled={isPending || loading}
                          icon={X}
                          color={defaultActions?.colorCancel}
                        >
                          {cancelText}
                        </SimpleButton>
                      )}
                      {confirmText && (
                        <SimpleButton
                          onClick={handleConfirmClick}
                          // loading={isPending || loading}
                          disabled={isPending || loading}
                          variant={defaultActions?.variantConfirm}
                          icon={icon}
                          color={defaultActions?.colorConfirm}
                        >
                          {confirmText}
                        </SimpleButton>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ),
          document.body
        )}
    </>
  );
};

export default Modal;
