"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

type DismissibleMenuProps = {
  wrapperClassName?: string;
  triggerClassName: string;
  panelClassName: string;
  triggerContent: ReactNode;
  children: ReactNode;
};

export function DismissibleMenu({
  wrapperClassName = "relative",
  triggerClassName,
  panelClassName,
  triggerContent,
  children,
}: DismissibleMenuProps) {
  const [open, setOpen] = useState(false);
  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const panelId = `${baseId}-panel`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const focusPanelOnOpenRef = useRef(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (target instanceof Node && rootRef.current?.contains(target)) {
        return;
      }

      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      focusPanelOnOpenRef.current = false;
      return;
    }

    if (!focusPanelOnOpenRef.current) {
      return;
    }

    focusPanelOnOpenRef.current = false;
    const focusTarget = panelRef.current?.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    focusTarget?.focus();
  }, [open]);

  return (
    <div ref={rootRef} className={wrapperClassName}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        className={triggerClassName}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown") {
            return;
          }

          event.preventDefault();
          focusPanelOnOpenRef.current = true;
          setOpen(true);
        }}
      >
        {triggerContent}
      </button>
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          className={panelClassName}
          onClickCapture={(event) => {
            if (event.target instanceof HTMLElement && event.target.closest("a")) {
              setOpen(false);
            }
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
