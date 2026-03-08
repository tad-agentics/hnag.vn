import { ReactNode } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  maxHeight?: string;
  /** Optional header right element (e.g. close button) */
  headerRight?: ReactNode;
  /** Optional custom header — overrides title/subtitle */
  header?: ReactNode;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxHeight = "80vh",
  headerRight,
  header,
}: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet-backdrop" />
      <div
        className="bottom-sheet-content"
        style={{ maxHeight }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bottom-sheet-handle" />

        {header ? (
          header
        ) : (
          <>
            {(title || headerRight) && (
              <div
                className="flex items-start justify-between"
                style={{ marginBottom: subtitle ? "0" : "24px" }}
              >
                {title && <h2>{title}</h2>}
                {headerRight}
              </div>
            )}
            {subtitle && (
              <p
                className="body-text"
                style={{ marginBottom: "24px", lineHeight: "1.6" }}
              >
                {subtitle}
              </p>
            )}
          </>
        )}

        {children}
      </div>
    </div>
  );
}
