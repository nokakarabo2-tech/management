import { useState } from 'react';
import Modal from './Modal.jsx';
import FormField from './FormField.jsx';
import {
  COURSES,
  EMPTY_FORM,
  MAX_AGE,
  MIN_AGE,
  isFormValid,
  toFormValues,
  validateStudent,
} from '../utils/studentUtils.js';

/**
 * StudentFormModal – one component used for BOTH adding and editing
 * (component reuse). The `mode` prop decides the title, button text
 * and starting values.
 *
 * The form is "controlled": every input's value comes from React state
 * and every change goes through handleChange.
 *
 * Props:
 *  mode      ('add' | 'edit')
 *  student   (object|null) – the student being edited
 *  students  (array)       – all students, for the duplicate-email check
 *  onSave    (function)    – receives the valid form values
 *  onCancel  (function)    – closes the modal without saving
 */
function StudentFormModal({ mode, student, students, onSave, onCancel }) {
  const isEditMode = mode === 'edit';
  const editingId = isEditMode ? student.id : null;

  // Lazy initial state: computed once when the modal opens.
  const [values, setValues] = useState(() =>
    isEditMode ? toFormValues(student) : { ...EMPTY_FORM }
  );
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // One handler for all inputs: uses the input's `name` to update the right field.
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValues = { ...values, [name]: type === 'checkbox' ? checked : value };
    setValues(nextValues);

    // After the first submit attempt, re-validate live so messages disappear as fixed.
    if (hasSubmitted) {
      setErrors(validateStudent(nextValues, students, editingId));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // stop the browser from reloading the page
    setHasSubmitted(true);

    const foundErrors = validateStudent(values, students, editingId);
    setErrors(foundErrors);

    // Prevent invalid submissions: only save when there are no errors.
    if (!isFormValid(foundErrors)) return;
    onSave(values);
  };

  const errorCount = Object.keys(errors).length;

  return (
    <Modal
      title={isEditMode ? `Edit student ${student.id}` : 'Add new student'}
      onClose={onCancel}
      footer={
        <>
          <button type="button" className="button button--secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" form="student-form" className="button button--primary">
            {isEditMode ? 'Save changes' : 'Add student'}
          </button>
        </>
      }
    >
      <form id="student-form" onSubmit={handleSubmit} noValidate>
        {errorCount > 0 && (
          <div className="form-summary" role="alert">
            Please fix {errorCount === 1 ? '1 field' : `${errorCount} fields`} before saving.
          </div>
        )}

        {isEditMode && (
          <div className="form-field">
            <span className="form-field__label">Student ID</span>
            <p className="readonly-value">{student.id}</p>
          </div>
        )}

        <FormField id="fullName" label="Full name" error={errors.fullName}>
          {(aria) => (
            <input
              {...aria}
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="e.g. Thabo Mokoena"
              value={values.fullName}
              onChange={handleChange}
              data-autofocus
            />
          )}
        </FormField>

        <div className="form-row">
          <FormField
            id="age"
            label="Age"
            error={errors.age}
            hint={`Between ${MIN_AGE} and ${MAX_AGE}`}
          >
            {(aria) => (
              <input
                {...aria}
                name="age"
                type="number"
                inputMode="numeric"
                min={MIN_AGE}
                max={MAX_AGE}
                step="1"
                placeholder="e.g. 20"
                value={values.age}
                onChange={handleChange}
              />
            )}
          </FormField>

          <FormField id="email" label="Email address" error={errors.email}>
            {(aria) => (
              <input
                {...aria}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={values.email}
                onChange={handleChange}
              />
            )}
          </FormField>
        </div>

        <FormField id="course" label="Course of study" error={errors.course}>
          {(aria) => (
            <select {...aria} name="course" value={values.course} onChange={handleChange}>
              <option value="">Select a course…</option>
              {COURSES.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <div className="form-field">
          <span className="form-field__label">Enrollment status</span>
          <label className="switch">
            <input
              type="checkbox"
              name="isEnrolled"
              checked={values.isEnrolled}
              onChange={handleChange}
            />
            <span className="switch__track" aria-hidden="true" />
            <span className="switch__text">
              {values.isEnrolled ? 'Currently enrolled' : 'Not enrolled'}
            </span>
          </label>
        </div>
      </form>
    </Modal>
  );
}

export default StudentFormModal;
