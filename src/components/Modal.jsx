import { useEffect, useId, useRef } from 'react';

/**
 * Modal – reusable dialog shell used by the Add/Edit form and the
 * Delete confirmation. It only renders while its parent decides it is
 * open (parent controls this with React state).
 *
 * Behaviour:
 *  - closes on Escape key, on the × button, or when clicking the dark overlay
 *  - moves keyboard focus into the dialog when it opens
 *    (to the element marked data-autofocus, otherwise the first control)
 *  - keeps Tab focus inside the dialog
 *  - stops the page behind it from scrolling
 *
 * Props:
 *  title    (string)   – heading text
 *  onClose  (function) – called when the user closes the modal
 *  children (JSX)      – modal body
 *  footer   (JSX)      – optional action buttons
 *  variant  (string)   – 'default' | 'danger' (changes the accent colour)
 */
function Modal({ title, onClose, children, footer, variant = 'default' }) {
  const titleId = useId();
  const dialogRef = useRef(null);

  // Keep the latest onClose in a ref so the effect below only runs once
  // (on open) instead of every time the parent re-renders.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement;

    // Focus the preferred element when the modal opens.
    const preferred =
      dialog.querySelector('[data-autofocus]') ||
      dialog.querySelector('input, select, textarea, button');
    preferred?.focus();

    // Arrow function used as the event handler.
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      // Simple focus trap: wrap Tab / Shift+Tab inside the dialog.
      if (event.key === 'Tab') {
        const focusable = dialog.querySelectorAll(
          'button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Cleanup runs when the modal closes (unmounts).
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  // Close only when the click starts on the overlay itself, not inside the dialog.
  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onMouseDown={handleOverlayMouseDown}>
      <div
        ref={dialogRef}
        className={`modal modal--${variant}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal__header">
          <h2 id={titleId} className="modal__title">
            {title}
          </h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
