/**
 * FormField – reusable label + control + error message wrapper.
 * Used for every input in the student form so labels, error styling
 * and accessibility attributes are consistent.
 *
 * Props:
 *  id       (string)  – id of the input (links the <label> to it)
 *  label    (string)  – visible label text
 *  error    (string)  – validation message, if any
 *  hint     (string)  – optional helper text
 *  children (function) – receives aria props and returns the input element
 */
function FormField({ id, label, error, hint, children }) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  // Build the aria-describedby value from whichever messages exist.
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ');

  return (
    <div className={`form-field ${error ? 'form-field--error' : ''}`}>
      <label htmlFor={id} className="form-field__label">
        {label} <span aria-hidden="true" className="required-mark">*</span>
      </label>
      {children({
        id,
        'aria-invalid': error ? 'true' : 'false',
        'aria-describedby': describedBy || undefined,
      })}
      {hint && !error && (
        <p id={hintId} className="form-field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="form-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
