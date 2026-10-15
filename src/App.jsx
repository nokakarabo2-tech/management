import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import StatsBar from './components/StatsBar.jsx';
import Toolbar from './components/Toolbar.jsx';
import StudentTable from './components/StudentTable.jsx';
import EmptyState from './components/EmptyState.jsx';
import StudentFormModal from './components/StudentFormModal.jsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx';
import Toast from './components/Toast.jsx';
import INITIAL_STUDENTS from './data/initialStudents.js';
import { loadStudents, saveStudents } from './utils/storage.js';
import {
  STATUS_FILTERS,
  addStudent,
  deleteStudent,
  filterStudents,
  getStudentStats,
  updateStudent,
} from './utils/studentUtils.js';

/** Modal types (const object so the strings are typed once and reused). */
const MODAL = {
  NONE: null,
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete',
};

/**
 * App – the root component. It OWNS all application state and passes
 * data down to child components through props; children send events
 * back up through callback props.
 *
 * State:
 *  students     – array of student objects (the source of truth)
 *  searchTerm   – text in the search box
 *  statusFilter – selected enrollment filter
 *  modal        – which modal is open and which student it is for
 *  toast        – current confirmation message (or null)
 */
function App() {
  // Lazy initialiser: read localStorage only once, on first render.
  const [students, setStudents] = useState(() => loadStudents(INITIAL_STUDENTS));
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(STATUS_FILTERS.ALL);
  const [modal, setModal] = useState({ type: MODAL.NONE, student: null });
  const [toast, setToast] = useState(null);

  // Persist to localStorage every time the students array changes.
  useEffect(() => {
    saveStudents(students);
  }, [students]);

  // ---- Derived values (calculated from state on every render, not stored) ----
  const visibleStudents = filterStudents(students, searchTerm, statusFilter);
  const stats = getStudentStats(students);

  // ---- Helpers ----
  const showToast = (message, variant = 'success') => {
    setToast({ id: Date.now(), message, variant });
  };
  const dismissToast = useCallback(() => setToast(null), []);

  // ---- Modal open/close handlers ----
  const openAddModal = () => setModal({ type: MODAL.ADD, student: null });
  const openEditModal = (student) => setModal({ type: MODAL.EDIT, student });
  const openDeleteModal = (student) => setModal({ type: MODAL.DELETE, student });
  const closeModal = useCallback(() => setModal({ type: MODAL.NONE, student: null }), []);

  // ---- CRUD handlers: each creates a NEW array, so React re-renders immediately ----
  const handleSaveStudent = (formValues) => {
    if (modal.type === MODAL.ADD) {
      const result = addStudent(students, formValues);
      setStudents(result.students);
      showToast(`${result.student.fullName} was added (${result.student.id}).`);
    } else if (modal.type === MODAL.EDIT) {
      setStudents(updateStudent(students, modal.student.id, formValues));
      showToast(`${modal.student.id} was updated.`);
    }
    closeModal();
  };

  const handleConfirmDelete = () => {
    const { student } = modal;
    setStudents(deleteStudent(students, student.id));
    showToast(`${student.fullName} was deleted.`, 'danger');
    closeModal();
  };

  const handleReset = () => {
    setStudents(INITIAL_STUDENTS);
    setSearchTerm('');
    setStatusFilter(STATUS_FILTERS.ALL);
    showToast('Sample data restored.', 'info');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter(STATUS_FILTERS.ALL);
  };

  return (
    <div className="app">
      <Header onAddClick={openAddModal} onResetClick={handleReset} />

      <main className="container">
        <StatsBar stats={stats} />

        <section className="panel" aria-label="Student records">
          <Toolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            resultCount={visibleStudents.length}
            totalCount={students.length}
          />

          {/* Conditional rendering: table when there are rows, otherwise an empty state */}
          {visibleStudents.length > 0 ? (
            <StudentTable students={visibleStudents} onEdit={openEditModal} onDelete={openDeleteModal} />
          ) : (
            <EmptyState
              hasStudents={students.length > 0}
              onAddClick={openAddModal}
              onClearFilters={clearFilters}
            />
          )}
        </section>
      </main>

      {/* Modals are only mounted while open, so each opening starts with fresh form state */}
      {(modal.type === MODAL.ADD || modal.type === MODAL.EDIT) && (
        <StudentFormModal
          mode={modal.type}
          student={modal.student}
          students={students}
          onSave={handleSaveStudent}
          onCancel={closeModal}
        />
      )}

      {modal.type === MODAL.DELETE && (
        <DeleteConfirmModal student={modal.student} onConfirm={handleConfirmDelete} onCancel={closeModal} />
      )}

      {toast && (
        <Toast key={toast.id} message={toast.message} variant={toast.variant} onDismiss={dismissToast} />
      )}
    </div>
  );
}

export default App;
