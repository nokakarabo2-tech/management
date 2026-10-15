import { useEffect } from 'react';

/**
 * Toast – short confirmation message ("Student added", etc.).
 * Disappears automatically after 3 seconds using setTimeout in useEffect.
 *
 * Props:
 *  message (string), variant ('success' | 'danger' | 'info'), onDismiss (function)
 */
function Toast({ message, variant = 'success', onDismiss }) {
  useEffect(() => {
    const timerId = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timerId); // cleanup if a new toast replaces this one
  }, [message, onDismiss]);

  return (
    <div className={`toast toast--${variant}`} role="status">
      <span>{message}</span>
      <button type="button" className="icon-button icon-button--light" onClick={onDismiss} aria-label="Dismiss message">
        ×
      </button>
    </div>
  );
}

export default Toast;
