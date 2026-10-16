import StatusBadge from './StatusBadge.jsx';

/**
 * StudentRow – one row of the dashboard table.
 * `data-label` attributes are used by the CSS to show each row as a
 * card with labels on small (mobile) screens.
 *
 * Props:
 *  student  (object)
 *  onEdit   (function) – called with the student
 *  onDelete (function) – called with the student
 */
function StudentRow({ student, onEdit, onDelete }) {
  return (
    <tr>
      <td data-label="ID" className="cell-id">
        {student.id}
      </td>
      <td data-label="Name">
        <span className="name-cell__name">{student.fullName}</span>
      </td>
      <td data-label="Age">{student.age}</td>
      <td data-label="Email" className="cell-email">
        <a href={`mailto:${student.email}`}>{student.email}</a>
      </td>
      <td data-label="Course">{student.course}</td>
      <td data-label="Status">
        <StatusBadge isEnrolled={student.isEnrolled} />
      </td>
      <td data-label="Actions" className="cell-actions">
        <button
          type="button"
          className="button button--small button--secondary"
          onClick={() => onEdit(student)}
          aria-label={`Edit ${student.fullName}`}
        >
          Edit
        </button>
        <button
          type="button"
          className="button button--small button--danger-outline"
          onClick={() => onDelete(student)}
          aria-label={`Delete ${student.fullName}`}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default StudentRow;