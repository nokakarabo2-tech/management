import StudentRow from './StudentRow.jsx';

/**
 * StudentTable – renders the list of students using map().
 * Each StudentRow gets a unique `key` (the student ID) so React can
 * track rows efficiently when the list changes.
 *
 * Props:
 *  students (array), onEdit (function), onDelete (function)
 */
function StudentTable({ students, onEdit, onDelete }) {
  return (
    <div className="table-wrapper">
      <table className="student-table">
        <caption className="visually-hidden">Student records</caption>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Full name</th>
            <th scope="col">Age</th>
            <th scope="col">Email</th>
            <th scope="col">Course</th>
            <th scope="col">Status</th>
            <th scope="col">
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <StudentRow key={student.id} student={student} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
