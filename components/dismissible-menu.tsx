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
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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

  return (
    <div ref={rootRef} className={wrapperClassName}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        className={triggerClassName}
        onClick={() => setOpen((current) => !current)}
      >
        {triggerContent}
      </button>
      {open ? (
        <div
          id={panelId}
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
