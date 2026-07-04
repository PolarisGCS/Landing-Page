import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const LightboxContext = createContext(null);

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used within a LightboxProvider");
  return ctx;
}

export function LightboxProvider({ children }) {
  const [image, setImage] = useState(null);

  const open = useCallback((src, alt) => setImage({ src, alt }), []);
  const close = useCallback(() => setImage(null), []);

  useEffect(() => {
    if (!image) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [image, close]);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {image &&
        createPortal(
          <div className="docs-lightbox" onClick={close} role="dialog" aria-modal="true" aria-label={image.alt}>
            <button
              type="button"
              className="docs-lightbox__close"
              onClick={close}
              aria-label="Close expanded image"
            >
              &times;
            </button>
            <figure className="docs-lightbox__figure" onClick={(e) => e.stopPropagation()}>
              <img src={image.src} alt={image.alt || "PolarisGCS screenshot"} />
              {image.alt && <figcaption>{image.alt}</figcaption>}
            </figure>
          </div>,
          document.body,
        )}
    </LightboxContext.Provider>
  );
}
